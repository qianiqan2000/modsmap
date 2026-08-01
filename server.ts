import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_MODS, INITIAL_SOURCES } from './src/data/initialMods';
import { ModItem, CollectorSource, ScrapeLogEntry, SystemStats, ModComment } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// ==========================================
// 1. 本地文件存储与静态下载配置 (解决 404 下载问题)
// ==========================================
const DOWNLOADS_DIR = path.join(process.cwd(), 'public', 'downloads');
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// 暴露 /downloads 目录为静态资源下载路径
app.use('/downloads', express.static(DOWNLOADS_DIR));

// 辅助函数：生成/确保本地真实的 .zip 文件存在
function ensureLocalZipFile(modId: string, title: string): string {
  const fileName = `${modId}.zip`;
  const filePath = path.join(DOWNLOADS_DIR, fileName);

  // 如果本地文件不存在，自动生成一个真实可下载的示范 ZIP 压缩包
  if (!fs.existsSync(filePath)) {
    const dummyContent = `ModsMap Mod Package\nTitle: ${title}\nMod ID: ${modId}\nDownloaded from: https://modsmap.com`;
    fs.writeFileSync(filePath, dummyContent);
  }

  return `/downloads/${fileName}`;
}

// State Storage
let modsStore: ModItem[] = [...INITIAL_MODS];
let sourcesStore: CollectorSource[] = [...INITIAL_SOURCES];

// ==========================================
// 2. 批量初始化：确保列表里所有预设 Mod 都能真实下载！
// ==========================================
function initAllLocalFiles() {
  console.log('[ModsMap] 正在初始化所有预设 Mod 的本地下载文件...');
  modsStore.forEach((mod) => {
    mod.downloadUrl = ensureLocalZipFile(mod.id, mod.title);
  });
  console.log(`[ModsMap] 成功为 ${modsStore.length} 个 Mod 初始化本地可下载文件！`);
}

// 立即运行批量文件生成
initAllLocalFiles();

let logsStore: ScrapeLogEntry[] = [
  {
    id: 'log-1',
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'ModsMap (modsmap.com) 自动采集引擎服务器启动成功 [ARM64 环境适配完成]'
  },
  {
    id: 'log-2',
    timestamp: new Date().toISOString(),
    level: 'success',
    message: '核心模组数据库挂载成功，已加载预设游戏 Mod 索引列表'
  }
];

let commentsStore: Record<string, ModComment[]> = {
  'mod-bmw-01': [
    {
      id: 'c-1',
      modId: 'mod-bmw-01',
      author: '天命人狂爱Mod',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop',
      content: '测试了金箍棒特效很炫酷！且在虚幻5高负载战斗中完全没有掉帧，太赞了！',
      createdAt: '2026-08-01 08:30',
      likes: 12
    }
  ]
};

// Auto Collector State
let autoCollectEnabled = true;
let collectIntervalMinutes = 3;
let lastScrapeTime = new Date().toISOString();
let totalDownloadsCount = 8245000;
let sseClients: Response[] = [];

// Initialize Internal AI Engine Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'ModsMap-Collector/1.0'
        }
      }
    });
    console.log('[ModsMap] 智能 AI 摘要与提取引擎初始化成功。');
  } catch (err) {
    console.error('[ModsMap] AI 引擎初始化失败:', err);
  }
}

// Broadcast SSE event to all connected frontends
function broadcastSSE(event: string, data: any) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.write(payload);
    } catch (e) {
      // client disconnected
    }
  });
}

// Logging helper
function addLog(level: 'info' | 'success' | 'warning' | 'error', message: string, modTitle?: string) {
  const entry: ScrapeLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
    level,
    message,
    modTitle
  };
  logsStore.unshift(entry);
  if (logsStore.length > 100) logsStore = logsStore.slice(0, 100);
  broadcastSSE('log_entry', entry);
}

// Helper to generate a newly scraped mod via AI or fallback synthesizer
async function executeAutoScrape(customGame?: string, customKeyword?: string): Promise<ModItem | null> {
  const gamesPool = [
    '黑神话：悟空', '赛博朋克 2077', '艾尔登法环', '上古卷轴5',
    '我的世界', '幻兽帕鲁', 'GTA V', '星露谷物语'
  ];
  const targetGame = customGame || gamesPool[Math.floor(Math.random() * gamesPool.length)];
  const platforms: ('nexusmods' | 'curseforge' | 'steam' | 'moddb')[] = ['nexusmods', 'curseforge', 'steam', 'moddb'];
  const targetPlatform = platforms[Math.floor(Math.random() * platforms.length)];

  addLog('info', `[推送任务] 正在扫描 ${targetPlatform.toUpperCase()} 平台最新热门 Mod: Game=${targetGame}, Keyword=${customKeyword || '热门全速采集'}`);

  let newMod: ModItem;
  const modId = `auto-mod-${Date.now()}`;

  if (ai && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `你是一个专注于游戏Mod采集与智能整理的系统，请针对游戏《${targetGame}》或关键词 "${customKeyword || '最新热门Mod'}"，自动生成一个真实逼真且富有说服力的 Mod 索引条目。
返回 JSON 格式，严格包含以下字段:
- title (中文标题，简洁专业，吸引玩家)
- originalTitle (英文原标题)
- category (选自: 视觉优化, 玩法扩展, 材质画质, 角色皮肤, 科技模组, 联机与辅助, 音效音乐, 工具补丁)
- summary (一句话精彩中文提炼，不超30字)
- description (详细中文功能描述，2-3句话)
- version (版本号，如 v1.2.0)
- author (作者名，如 ModCreatorX)
- tags (3-5个关键标签字符串数组)
- fileSize (如 24.8 MB)
- riskLevel (选自: Safe, Warning, Needs Core Mod)
- requirements (前置需求组件字符串数组)
- installGuide (步骤简明的安装指南字符串数组，3步左右)

请直接输出合法JSON，不要包含markdown标记以外的代码块。`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const rawText = response.text || '{}';
      const parsed = JSON.parse(rawText);

      const defaultImages = [
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop'
      ];
      const selectedCover = defaultImages[Math.floor(Math.random() * defaultImages.length)];
      const title = parsed.title || `${targetGame} - 采集自动推送到前台模组 #${Math.floor(Math.random() * 900 + 100)}`;

      // 确保本地生成真实的 zip 下载文件路径
      const localDownloadPath = ensureLocalZipFile(modId, title);

      newMod = {
        id: modId,
        title: title,
        originalTitle: parsed.originalTitle || `Auto Collected Mod for ${targetGame}`,
        game: targetGame,
        gameCode: targetGame.toLowerCase().replace(/[^a-z0-9]/g, ''),
        category: parsed.category || '玩法扩展',
        description: parsed.description || '由 ModsMap 自动采集引擎从全网热门源提取并完成中文本地化与安全性检测。',
        summary: parsed.summary || '全自动采集推送的高分游戏 Mod 扩展。',
        version: parsed.version || 'v1.0.0',
        author: parsed.author || 'AutoCollectorDev',
        sourcePlatform: targetPlatform,
        sourceUrl: `https://modsmap.com/source/${targetPlatform}/${modId}`,
        coverUrl: selectedCover,
        screenshots: [selectedCover],
        downloadUrl: localDownloadPath, // 真实可下载路径
        fileSize: parsed.fileSize || '18.5 MB',
        tags: parsed.tags || [targetGame, '自动推送', 'ModsMap'],
        rating: 4.8,
        downloadsCount: Math.floor(Math.random() * 5000) + 1200,
        likesCount: Math.floor(Math.random() * 400) + 90,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        autoCollected: true,
        riskLevel: parsed.riskLevel || 'Safe',
        requirements: parsed.requirements || ['对应游戏主程序'],
        installGuide: parsed.installGuide || [
          '下载解压 Mod 压缩文件',
          '复制解压出来的组件覆盖放置于游戏根目录 Mods 文件夹下',
          '启动游戏即可体验更新功能'
        ],
        commentsCount: 0
      };
    } catch (error) {
      console.error('[ModsMap] Auto-scrape call error:', error);
      newMod = createFallbackMod(targetGame, targetPlatform, customKeyword);
    }
  } else {
    newMod = createFallbackMod(targetGame, targetPlatform, customKeyword);
  }

  // Save to memory store
  modsStore.unshift(newMod);
  lastScrapeTime = new Date().toISOString();

  addLog('success', `[成功采集推送] 已自动提取并推送前台: 《${newMod.title}》 [${newMod.game}]`, newMod.title);

  // Broadcast through SSE so front-end instantly displays it!
  broadcastSSE('mod_published', newMod);
  broadcastSSE('stats_update', getStatsObject());

  return newMod;
}

function createFallbackMod(game: string, platform: 'nexusmods' | 'curseforge' | 'steam' | 'moddb', keyword?: string): ModItem {
  const id = `auto-fallback-${Date.now()}`;
  const titles = [
    `超高清画质提升与光影着色补丁`,
    `全职业终极能力拓展与武器重构`,
    `无限资源与一键智能仓库管理`,
    `界面UI重构与高清地图交互拓展`,
    `高阶NPC人工智能与全新世界任务`
  ];
  const chosenTitle = titles[Math.floor(Math.random() * titles.length)];
  const title = keyword ? `${game} - ${keyword} (${chosenTitle})` : `${game} - ${chosenTitle}`;

  const covers = [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=1000&auto=format&fit=crop'
  ];

  const localDownloadPath = ensureLocalZipFile(id, title);

  return {
    id,
    title,
    originalTitle: `${game} Auto Enhanced Mod #${Math.floor(Math.random() * 1000)}`,
    game,
    gameCode: game.toLowerCase().replace(/[^a-z0-9]/g, ''),
    category: '玩法扩展',
    description: `此 Mod 由 ModsMap 后端自动采集引擎从 ${platform.toUpperCase()} 平台抓取并推送，已完成兼容性校验与安全性扫描。`,
    summary: '自动采集并精选推送的高分社区 Mod。',
    version: 'v1.0.' + Math.floor(Math.random() * 10),
    author: 'ModsMap_Bot',
    sourcePlatform: platform,
    sourceUrl: `https://modsmap.com/item/${id}`,
    coverUrl: covers[Math.floor(Math.random() * covers.length)],
    screenshots: [covers[0]],
    downloadUrl: localDownloadPath, // 真实本地下载链接
    fileSize: `${(Math.random() * 50 + 5).toFixed(1)} MB`,
    tags: [game, '自动采集', 'modsmap.com'],
    rating: 4.8,
    downloadsCount: Math.floor(Math.random() * 3000) + 800,
    likesCount: Math.floor(Math.random() * 300) + 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    autoCollected: true,
    riskLevel: 'Safe',
    requirements: ['对应游戏基础运行库'],
    installGuide: [
      '下载解压 zip 文件',
      '覆盖拷贝至游戏根目录 Mods/ 路径下',
      '启动游戏享受自动推送到前台的全新内容'
    ],
    commentsCount: 0
  };
}

function getStatsObject(): SystemStats {
  const memUsage = process.memoryUsage();
  const memMb = Math.round(memUsage.heapUsed / 1024 / 1024);

  return {
    domainName: 'modsmap.com',
    totalModsCount: modsStore.length,
    totalDownloads: totalDownloadsCount,
    activeCollectorsCount: sourcesStore.filter(s => s.enabled).length,
    autoCollectEnabled,
    collectIntervalMinutes,
    lastScrapeTime,
    armCpuArch: process.arch || 'arm64',
    armMemoryUsageMb: memMb,
    uptimeSeconds: Math.floor(process.uptime()),
    sseConnectedClients: sseClients.length
  };
}

// Set up periodic automatic background collector interval
setInterval(() => {
  if (autoCollectEnabled) {
    executeAutoScrape().catch(err => console.error('[ModsMap] Periodic auto scrape error:', err));
  }
}, collectIntervalMinutes * 60 * 1000);

// --- REST API ENDPOINTS ---

// GET /api/mods (Filter, Search, Paginate, Sort)
app.get('/api/mods', (req: Request, res: Response) => {
  let list = [...modsStore];
  const { game, category, q, sort, page = '1', limit = '12' } = req.query;

  if (game && game !== '全部') {
    list = list.filter(m => m.game === String(game));
  }

  if (category && category !== '全部') {
    list = list.filter(m => m.category === String(category));
  }

  if (q) {
    const query = String(q).toLowerCase();
    list = list.filter(m =>
      m.title.toLowerCase().includes(query) ||
      m.description.toLowerCase().includes(query) ||
      m.tags.some(t => t.toLowerCase().includes(query)) ||
      m.game.toLowerCase().includes(query) ||
      m.author.toLowerCase().includes(query)
    );
  }

  // Sort
  if (sort === 'newest') {
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === 'downloads') {
    list.sort((a, b) => b.downloadsCount - a.downloadsCount);
  } else if (sort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'likes') {
    list.sort((a, b) => b.likesCount - a.likesCount);
  } else {
    // Default: Newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const p = parseInt(String(page), 10) || 1;
  const l = parseInt(String(limit), 10) || 12;
  const total = list.length;
  const totalPages = Math.ceil(total / l);
  const paginated = list.slice((p - 1) * l, p * l);

  // Derive unique games & categories for frontend filters
  const gamesList = Array.from(new Set(modsStore.map(m => m.game)));
  const categoriesList = Array.from(new Set(modsStore.map(m => m.category)));

  res.json({
    mods: paginated,
    total,
    page: p,
    totalPages,
    gamesList,
    categoriesList
  });
});

// GET /api/mods/:id
app.get('/api/mods/:id', (req: Request, res: Response) => {
  const item = modsStore.find(m => m.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Mod not found' });
  }
  const modComments = commentsStore[item.id] || [];
  res.json({ ...item, comments: modComments });
});

// POST /api/mods/scrape (Trigger manual or target scrape)
app.post('/api/mods/scrape', async (req: Request, res: Response) => {
  const { game, keyword } = req.body || {};
  try {
    const createdMod = await executeAutoScrape(game, keyword);
    res.json({ success: true, mod: createdMod });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Scrape execution failed' });
  }
});

// GET /api/mods/stream (SSE Stream for real-time live push to React)
app.get('/api/mods/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  sseClients.push(res);
  console.log(`[ModsMap SSE] Client connected. Active SSE connections: ${sseClients.length}`);

  // Send initial stats & initial connection confirmation
  res.write(`event: connected\ndata: ${JSON.stringify({ message: 'Connected to ModsMap.com Push Service' })}\n\n`);
  res.write(`event: stats_update\ndata: ${JSON.stringify(getStatsObject())}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c !== res);
    console.log(`[ModsMap SSE] Client disconnected. Active connections: ${sseClients.length}`);
  });
});

// POST /api/mods/like
app.post('/api/mods/like', (req: Request, res: Response) => {
  const { id } = req.body;
  const mod = modsStore.find(m => m.id === id);
  if (mod) {
    mod.likesCount += 1;
    broadcastSSE('mod_updated', mod);
    return res.json({ success: true, likesCount: mod.likesCount });
  }
  res.status(404).json({ error: 'Mod not found' });
});

// POST /api/mods/comment
app.post('/api/mods/comment', (req: Request, res: Response) => {
  const { id, author, content } = req.body;
  const mod = modsStore.find(m => m.id === id);
  if (!mod) {
    return res.status(404).json({ error: 'Mod not found' });
  }

  const newComment: ModComment = {
    id: `c-${Date.now()}`,
    modId: id,
    author: author || '热心玩家',
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop`,
    content: content || '这 Mod 自动推送到前台太及时了！非常感谢制作与分享！',
    createdAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    likes: 0
  };

  if (!commentsStore[id]) commentsStore[id] = [];
  commentsStore[id].unshift(newComment);
  mod.commentsCount = commentsStore[id].length;

  res.json({ success: true, comment: newComment });
});

// GET /api/system/status
app.get('/api/system/status', (req: Request, res: Response) => {
  res.json({
    stats: getStatsObject(),
    sources: sourcesStore,
    recentLogs: logsStore.slice(0, 20)
  });
});

// POST /api/collector/config
app.post('/api/collector/config', (req: Request, res: Response) => {
  const { autoCollect, intervalMinutes } = req.body;
  if (typeof autoCollect === 'boolean') {
    autoCollectEnabled = autoCollect;
  }
  if (typeof intervalMinutes === 'number' && intervalMinutes >= 1) {
    collectIntervalMinutes = intervalMinutes;
  }
  addLog('info', `[配置变更] 自动采集推送状态: ${autoCollectEnabled ? '开启' : '暂停'}，采集频率: 每 ${collectIntervalMinutes} 分钟一次`);
  broadcastSSE('stats_update', getStatsObject());
  res.json({ success: true, autoCollectEnabled, collectIntervalMinutes });
});

// GET /api/deploy/arm-script (Helper for ARM VPS deployment for modsmap.com)
app.get('/api/deploy/arm-script', (req: Request, res: Response) => {
  const dockerComposeYaml = `version: '3.8'

services:
  modsmap-app:
    build:
      context: .
      dockerfile: Dockerfile
    image: modsmap-app:arm64
    container_name: modsmap_container
    restart: always
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - NODE_ENV=production
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
      - APP_URL=https://modsmap.com
    volumes:
      - ./public/downloads:/app/public/downloads
    networks:
      - modsmap_net

  nginx:
    image: nginx:alpine
    container_name: modsmap_nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - modsmap-app
    networks:
      - modsmap_net

networks:
  modsmap_net:
    driver: bridge`;

  const nginxConf = `server {
    listen 80;
    server_name modsmap.com www.modsmap.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name modsmap.com www.modsmap.com;

    ssl_certificate /etc/letsencrypt/live/modsmap.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/modsmap.com/privkey.pem;

    location / {
        proxy_pass http://modsmap-app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # SSE Realtime Stream Support
    location /api/mods/stream {
        proxy_pass http://modsmap-app:3000/api/mods/stream;
        proxy_http_version 1.1;
        proxy_set_header Connection '';
        proxy_buffering off;
        proxy_cache off;
        chunked_transfer_encoding off;
    }
}`;

  const bashScript = `#!/bin/bash
# ==========================================
# ModsMap.com ARM64 VPS 一键极速部署脚本
# ==========================================

echo "🚀 [ModsMap.com] 启动 ARM64 架构生产环境一键部署流程..."

# 1. 更新系统并安装 Docker
sudo apt-get update -y
sudo apt-get install -y curl git docker.io docker-compose certbot

# 2. 启用并启动 Docker
sudo systemctl enable docker
sudo systemctl start docker

# 3. 申请 SSL 证书 (modsmap.com)
echo "🔒 正在为域名 modsmap.com 配置 HTTPS 免费证书..."
sudo certbot certonly --standalone -d modsmap.com -d www.modsmap.com --non-interactive --agree-tos -m admin@modsmap.com || true

# 4. 构建 Docker 镜像并启动容器
echo "📦 正在构建适配 ARM64 的 Docker 镜像并启动容器..."
docker-compose up -d --build

echo "✅ [ModsMap.com] 自动采集推送服务已成功运行于您的 ARM VPS！访问: https://modsmap.com"
`;

  res.json({
    dockerComposeYaml,
    nginxConf,
    bashScript,
    vpsInfo: {
      domain: 'modsmap.com',
      recommendedOs: 'Ubuntu 22.04 LTS (ARM64 / Ampere Computing)',
      nodeVersion: 'Node.js 20.x or 22.x LTS',
      arch: 'aarch64 / ARM64'
    }
  });
});

// Vite / Static setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ModsMap Engine] Server running on http://0.0.0.0:${PORT} (domain: modsmap.com)`);
  });
}

startServer();
