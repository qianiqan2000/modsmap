import { ModItem, CollectorSource } from '../types';

export const INITIAL_MODS: ModItem[] = [
  {
    id: 'mod-bmw-01',
    title: '黑神话：悟空 - 画质优化与如意金箍棒光特效增强',
    originalTitle: 'Black Myth Wukong - Graphics & Ruyi Jingu Staff Glow FX Plus',
    game: '黑神话：悟空',
    gameCode: 'wukong',
    category: '视觉优化',
    description: '此Mod全面重构了《黑神话：悟空》的金箍棒符文光效与招式轨迹粒子的自发光强度，并去除了默认虚幻5引擎的过重胶片颗粒感，提高超宽屏与DLSS 3.5下的暗部细节度。',
    summary: '提升金箍棒自发光与招式轨迹特效，优化虚幻5引擎暗部细节，提升帧率稳定性。',
    version: 'v2.4.1',
    author: 'WukongModder',
    sourcePlatform: 'nexusmods',
    sourceUrl: 'https://www.nexusmods.com/blackmythwukong/mods/108',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop'
    ],
    downloadUrl: 'https://modsmap.com/downloads/bmw-graphics-fx-v2.4.1.zip',
    fileSize: '48.2 MB',
    tags: ['黑神话', '金箍棒', '特效', '画质优化', 'UE5'],
    rating: 4.9,
    downloadsCount: 128500,
    likesCount: 9420,
    createdAt: '2026-07-28T14:20:00Z',
    updatedAt: '2026-08-01T08:10:00Z',
    autoCollected: true,
    riskLevel: 'Safe',
    requirements: ['b1-Win64-Shipping.exe Base Engine Support'],
    installGuide: [
      '解压 zip 压缩包',
      '将解压得到的 `.pak` 文件移动至游戏安装目录 `b1/Content/Paks/~mods/`（若不存在 ~mods 文件夹请手动创建）',
      '在Steam启动选项中添加 `-fileopenlog` 参数后启动游戏'
    ],
    commentsCount: 342
  },
  {
    id: 'mod-cp2077-01',
    title: '赛博朋克2077 - 夜之城全息飞艇与超梦沉浸式拓展',
    originalTitle: 'Cyberpunk 2077 - Night City Flying Vehicles & Braindance Overhaul',
    game: '赛博朋克 2077',
    gameCode: 'cyberpunk2077',
    category: '玩法扩展',
    description: '解锁夜之城高空全息AV飞艇自驾功能，可以在夜之城摩天大楼顶端自由降落并体验全新的高空超梦俱乐部，并新增了20余首电台音乐。',
    summary: '支持驾驶AV飞艇俯瞰夜之城，开放楼顶高空隐秘区域与全新超梦交互。',
    version: 'v3.1.0',
    author: 'V_NightCityDev',
    sourcePlatform: 'nexusmods',
    sourceUrl: 'https://www.nexusmods.com/cyberpunk2077/mods/4819',
    coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1000&auto=format&fit=crop'
    ],
    downloadUrl: 'https://modsmap.com/downloads/cp2077-flying-av-v3.1.0.zip',
    fileSize: '112.5 MB',
    tags: ['赛博朋克', '飞艇', '夜之城', 'CET', 'Redscript'],
    rating: 4.8,
    downloadsCount: 245000,
    likesCount: 18900,
    createdAt: '2026-07-25T09:15:00Z',
    updatedAt: '2026-07-30T16:45:00Z',
    autoCollected: true,
    riskLevel: 'Needs Core Mod',
    requirements: ['Cyber Engine Tweaks (CET)', 'Redscript v0.5.18+'],
    installGuide: [
      '确保已安装最新版本的 Cyber Engine Tweaks',
      '将解压出来的 `bin` 与 `r6` 文件夹直接覆盖放入 《赛博朋克2077》 根目录',
      '启动游戏按 `~` 键打开 CET 控制台验证脚本加载成功'
    ],
    commentsCount: 512
  },
  {
    id: 'mod-elden-01',
    title: '艾尔登法环 - 交界地高难Boss无缝联机与随机化框架',
    originalTitle: 'Elden Ring - Seamless Co-op & Randomizer Expanded',
    game: '艾尔登法环',
    gameCode: 'eldenring',
    category: '联机与辅助',
    description: '支持最多6人无缝协同探索交界地，死亡不会踢出队伍，完美保留卢恩与剧情进度。内置可选的Boss与装备随机生成器。',
    summary: '完美6人无缝联机框架，支持同屏探索、大世界骑马与Boss全随机挑战。',
    version: 'v1.8.2',
    author: 'LukeYui',
    sourcePlatform: 'nexusmods',
    sourceUrl: 'https://www.nexusmods.com/eldenring/mods/510',
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop'
    ],
    downloadUrl: 'https://modsmap.com/downloads/elden-seamless-coop-v1.8.2.zip',
    fileSize: '15.8 MB',
    tags: ['艾尔登法环', '无缝联机', '随机化', '多层地牢'],
    rating: 5.0,
    downloadsCount: 890000,
    likesCount: 65000,
    createdAt: '2026-07-20T11:00:00Z',
    updatedAt: '2026-07-31T12:00:00Z',
    autoCollected: true,
    riskLevel: 'Safe',
    requirements: ['艾尔登法环正版游戏'],
    installGuide: [
      '解压文件放入游戏根目录 `Game/` 文件夹',
      '编辑 `ersc_settings.ini` 设置你的专属联机密码',
      '使用 `launch_ersc_steam.exe` 启动专服联机模式（隔离EAC反作弊）'
    ],
    commentsCount: 1204
  },
  {
    id: 'mod-skyrim-01',
    title: '上古卷轴5 - 天际4K高清物理材质包与光线追踪重制版',
    originalTitle: 'Skyrim SE - Skyland 4K Parallax & Community Shaders 2026',
    game: '上古卷轴5',
    gameCode: 'skyrim',
    category: '材质画质',
    description: '全面覆盖天际省所有城堡、雪山、地牢、植被与溪流水体4K视差贴图，完美整合最新社区Shader光追与DLSS/FSR3深度学习放大。',
    summary: '老次世代天际顶级4K视差材质库，重塑天际雪景与远景微光真实光影。',
    version: 'v5.0.1',
    author: 'SkyKing2020',
    sourcePlatform: 'nexusmods',
    sourceUrl: 'https://www.nexusmods.com/skyrimspecialedition/mods/3808',
    coverUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000&auto=format&fit=crop'
    ],
    downloadUrl: 'https://modsmap.com/downloads/skyrim-skyland-4k-v5.0.1.zip',
    fileSize: '4.2 GB',
    tags: ['上古卷轴', '4K视差', '光线追踪', '重置版', 'SKSE'],
    rating: 4.9,
    downloadsCount: 1540000,
    likesCount: 98000,
    createdAt: '2026-07-15T18:30:00Z',
    updatedAt: '2026-07-29T20:10:00Z',
    autoCollected: true,
    riskLevel: 'Needs Core Mod',
    requirements: ['SKSE64', 'Address Library for SKSE Plugins'],
    installGuide: [
      '推荐使用 Mod Organizer 2 (MO2) 或 Vortex 管理器安装',
      '将 zip 导入 MO2 左侧列表并勾选覆盖原有低清材质',
      '确保在 ENB 或 Community Shaders 中开启 Parallax 视差开关'
    ],
    commentsCount: 880
  },
  {
    id: 'mod-mc-01',
    title: '我的世界 - 物理机械工业与红石自动化生态重构 (1.21+)',
    originalTitle: 'Minecraft - Create Mod: Modern Physics & Automation Engine',
    game: '我的世界',
    gameCode: 'minecraft',
    category: '科技模组',
    description: 'Create模组为Minecraft带来了完全基于齿轮、轴承、传送带与气缸的真实机械动力系统，搭配高清光影与物理碰撞，可建造自动列车与自动化工厂。',
    summary: '蒸汽朋克物理机械工业架构，纯转轴齿轮与链条传动的自动化工厂科技树。',
    version: 'v0.6.2-1.21',
    author: 'simibubi',
    sourcePlatform: 'curseforge',
    sourceUrl: 'https://www.curseforge.com/minecraft/mc-mods/create',
    coverUrl: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=1000&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?q=80&w=1000&auto=format&fit=crop'
    ],
    downloadUrl: 'https://modsmap.com/downloads/create-mc1.21-v0.6.2.jar',
    fileSize: '32.4 MB',
    tags: ['Minecraft', 'Create', '机械动力', 'Forge', 'Fabric'],
    rating: 4.95,
    downloadsCount: 3200000,
    likesCount: 210000,
    createdAt: '2026-07-10T10:00:00Z',
    updatedAt: '2026-07-28T09:00:00Z',
    autoCollected: true,
    riskLevel: 'Safe',
    requirements: ['Minecraft 1.21.x', 'Forge 51.0+ / Fabric + Fabric API'],
    installGuide: [
      '确保已安装好对应版本的 Forge 或 Fabric 客户端',
      '下载 `.jar` 文件并放入 `.minecraft/mods` 目录中',
      '启动游戏即可在创造模式选项卡中查看“机械动力”机械组件'
    ],
    commentsCount: 1650
  },
  {
    id: 'mod-pal-01',
    title: '幻兽帕鲁 - 基地自动化上限提升与帕鲁一键工作调配器',
    originalTitle: 'Palworld - Base Automation Cap Increase & Pal Job Dispatcher',
    game: '幻兽帕鲁',
    gameCode: 'palworld',
    category: '辅助工具',
    description: '将终端基地允许容纳的帕鲁数量提高至50只，并提供极度便利的智能工作调配界面，精准指定每只帕鲁砍树、采矿、搬运或配种。',
    summary: '突破基地帕鲁上限至50只，新增可视化的工作优先级面板与帕鲁状态提醒。',
    version: 'v1.4.0',
    author: 'PalEngineers',
    sourcePlatform: 'nexusmods',
    sourceUrl: 'https://www.nexusmods.com/palworld/mods/102',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop'
    ],
    downloadUrl: 'https://modsmap.com/downloads/palworld-base-automation-v1.4.0.zip',
    fileSize: '8.4 MB',
    tags: ['幻兽帕鲁', '基地自动化', 'UEVR', '帕鲁工作'],
    rating: 4.85,
    downloadsCount: 420000,
    likesCount: 31000,
    createdAt: '2026-07-22T15:40:00Z',
    updatedAt: '2026-07-31T19:20:00Z',
    autoCollected: true,
    riskLevel: 'Safe',
    requirements: ['UE4SS for Palworld'],
    installGuide: [
      '解压 UE4SS 放入 `Pal/Binaries/Win64/`',
      '将 Mod 文件夹放入 `Pal/Binaries/Win64/Mods/`',
      '在 `mods.txt` 中开启 `PalJobDispatcher : 1` 启动 Mod'
    ],
    commentsCount: 290
  }
];

export const INITIAL_SOURCES: CollectorSource[] = [
  {
    id: 'src-01',
    name: 'NexusMods - 黑神话：悟空 RSS/API 热门采集源',
    platform: 'nexusmods',
    game: '黑神话：悟空',
    feedUrl: 'https://rss.nexusmods.com/blackmythwukong/trending.xml',
    enabled: true,
    lastRunTime: '2026-08-01 09:30:00',
    totalCollected: 48
  },
  {
    id: 'src-02',
    name: 'NexusMods - 赛博朋克2077 新近推送到前台',
    platform: 'nexusmods',
    game: '赛博朋克 2077',
    feedUrl: 'https://rss.nexusmods.com/cyberpunk2077/latest.xml',
    enabled: true,
    lastRunTime: '2026-08-01 09:45:00',
    totalCollected: 124
  },
  {
    id: 'src-03',
    name: 'CurseForge - Minecraft 1.21+ 优质Mod自动化订阅',
    platform: 'curseforge',
    game: '我的世界',
    feedUrl: 'https://api.curseforge.com/v1/mods/featured/mc',
    enabled: true,
    lastRunTime: '2026-08-01 10:00:00',
    totalCollected: 310
  },
  {
    id: 'src-04',
    name: 'Steam Workshop - 艾尔登法环 & 游戏社区工坊采集器',
    platform: 'steam',
    game: '艾尔登法环',
    feedUrl: 'https://steamcommunity.com/workshop/browse/?appid=1245620',
    enabled: true,
    lastRunTime: '2026-08-01 08:20:00',
    totalCollected: 89
  }
];
