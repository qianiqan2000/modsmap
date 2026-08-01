import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Search, 
  Sparkles, 
  Filter, 
  ArrowUpDown, 
  Zap, 
  RefreshCw, 
  Globe, 
  Layers, 
  Terminal, 
  Cpu, 
  CheckCircle2, 
  Radio, 
  Database,
  SlidersHorizontal,
  Flame,
  Star,
  Download,
  ThumbsUp
} from 'lucide-react';
import { ModItem, SystemStats, CollectorSource, ScrapeLogEntry } from './types';
import { Navbar } from './components/Navbar';
import { StatsBanner } from './components/StatsBanner';
import { ModCard } from './components/ModCard';
import { ModDetailModal } from './components/ModDetailModal';
import { AutoScraperDrawer } from './components/AutoScraperDrawer';
import { ArmDeployModal } from './components/ArmDeployModal';
import { LivePushToast } from './components/LivePushToast';

export default function App() {
  const [mods, setMods] = useState<ModItem[]>([]);
  const [gamesList, setGamesList] = useState<string[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [selectedGame, setSelectedGame] = useState('全部');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'downloads' | 'rating' | 'likes'>('newest');

  const [selectedMod, setSelectedMod] = useState<ModItem | null>(null);
  const [modComments, setModComments] = useState<any[]>([]);

  const [stats, setStats] = useState<SystemStats | null>(null);
  const [sources, setSources] = useState<CollectorSource[]>([]);
  const [logs, setLogs] = useState<ScrapeLogEntry[]>([]);

  const [isScraperOpen, setIsScraperOpen] = useState(false);
  const [isArmDeployOpen, setIsArmDeployOpen] = useState(false);
  const [isScraping, setIsScraping] = useState(false);

  const [latestPushedMod, setLatestPushedMod] = useState<ModItem | null>(null);
  const [autoPushCount, setAutoPushCount] = useState(0);

  // Load initial mods list from server
  const fetchMods = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (selectedGame !== '全部') queryParams.set('game', selectedGame);
      if (selectedCategory !== '全部') queryParams.set('category', selectedCategory);
      if (searchQuery) queryParams.set('q', searchQuery);
      queryParams.set('sort', sortBy);

      const res = await fetch(`/api/mods?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMods(data.mods || []);
        if (data.gamesList) setGamesList(data.gamesList);
        if (data.categoriesList) setCategoriesList(data.categoriesList);
      }
    } catch (err) {
      console.error('Failed to fetch mods:', err);
    }
  };

  // Load system stats & logs
  const fetchSystemStatus = async () => {
    try {
      const res = await fetch('/api/system/status');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setSources(data.sources || []);
        setLogs(data.recentLogs || []);
      }
    } catch (err) {
      console.error('Failed to fetch system status:', err);
    }
  };

  // Connect SSE real-time push stream from backend
  useEffect(() => {
    fetchMods();
    fetchSystemStatus();

    const eventSource = new EventSource('/api/mods/stream');

    eventSource.addEventListener('mod_published', (e: MessageEvent) => {
      try {
        const newMod: ModItem = JSON.parse(e.data);
        setMods((prev) => [newMod, ...prev.filter(m => m.id !== newMod.id)]);
        setLatestPushedMod(newMod);
        setAutoPushCount((prev) => prev + 1);
      } catch (err) {
        console.error('SSE mod_published parse error:', err);
      }
    });

    eventSource.addEventListener('stats_update', (e: MessageEvent) => {
      try {
        const newStats: SystemStats = JSON.parse(e.data);
        setStats(newStats);
      } catch (err) {
        console.error('SSE stats_update parse error:', err);
      }
    });

    eventSource.addEventListener('log_entry', (e: MessageEvent) => {
      try {
        const newLog: ScrapeLogEntry = JSON.parse(e.data);
        setLogs((prev) => [newLog, ...prev.slice(0, 50)]);
      } catch (err) {
        console.error('SSE log_entry parse error:', err);
      }
    });

    return () => {
      eventSource.close();
    };
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    fetchMods();
  }, [selectedGame, selectedCategory, searchQuery, sortBy]);

  // Load single mod detail and comments when selected
  const handleSelectMod = async (mod: ModItem) => {
    setSelectedMod(mod);
    try {
      const res = await fetch(`/api/mods/${mod.id}`);
      if (res.ok) {
        const data = await res.json();
        setModComments(data.comments || []);
      }
    } catch (e) {
      console.error('Failed to load mod detail:', e);
    }
  };

  // Like Mod
  const handleLikeMod = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await fetch('/api/mods/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        const data = await res.json();
        setMods((prev) =>
          prev.map((m) => (m.id === id ? { ...m, likesCount: data.likesCount } : m))
        );
        if (selectedMod && selectedMod.id === id) {
          setSelectedMod((prev) => prev ? { ...prev, likesCount: data.likesCount } : null);
        }
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  // Submit comment
  const handleAddComment = async (modId: string, author: string, content: string) => {
    try {
      const res = await fetch('/api/mods/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: modId, author, content })
      });
      if (res.ok) {
        const data = await res.json();
        setModComments((prev) => [data.comment, ...prev]);
      }
    } catch (err) {
      console.error('Comment submission error:', err);
    }
  };

  // Trigger manual scrape
  const handleTriggerScrape = async (customGame?: string, customKeyword?: string) => {
    setIsScraping(true);
    try {
      const res = await fetch('/api/mods/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: customGame, keyword: customKeyword })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.mod) {
          setLatestPushedMod(data.mod);
          setSelectedMod(data.mod);
        }
      }
    } catch (err) {
      console.error('Scrape error:', err);
    } finally {
      setIsScraping(false);
    }
  };

  // Update auto collector toggle & interval
  const handleToggleAutoCollect = async (enabled: boolean, intervalMinutes: number) => {
    try {
      const res = await fetch('/api/collector/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoCollect: enabled, intervalMinutes })
      });
      if (res.ok) {
        fetchSystemStatus();
      }
    } catch (err) {
      console.error('Collector config update error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      
      {/* Navbar Header */}
      <Navbar
        stats={stats}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        gamesList={gamesList}
        onOpenScraper={() => setIsScraperOpen(true)}
        onOpenArmDeploy={() => setIsArmDeployOpen(true)}
        onTriggerScrape={() => handleTriggerScrape()}
        isScraping={isScraping}
        autoPushCount={autoPushCount}
      />

      {/* Stats & Domain Banner */}
      <StatsBanner
        stats={stats}
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        gamesList={gamesList}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categoriesList={categoriesList}
        totalModsCount={mods.length}
      />

      {/* Main Directory & Grid Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6 w-full">
        
        {/* Controls & Sorting Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              {selectedGame === '全部' ? '全网自动采集 Mod 精选库' : `《${selectedGame}》精选 Mod 列表`}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono text-xs">
              {mods.length} 个
            </span>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              排序:
            </span>
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setSortBy('newest')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  sortBy === 'newest' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                最新推送
              </button>
              <button
                onClick={() => setSortBy('downloads')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  sortBy === 'downloads' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                热门下载
              </button>
              <button
                onClick={() => setSortBy('rating')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  sortBy === 'rating' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                最高评分
              </button>
            </div>
          </div>

        </div>

        {/* Mod Cards Grid */}
        {mods.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-4">
            <Bot className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
            <div className="space-y-1">
              <h3 className="font-bold text-slate-300 text-base">未找到符合条件的 Mod 模组</h3>
              <p className="text-xs text-slate-500">点击下方的按钮，触发采集引擎为您抓取并生成新的 Mod 数据</p>
            </div>
            <button
              onClick={() => handleTriggerScrape()}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20"
            >
              一键触发 AI 抓取并推送到前台
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mods.map((m) => (
              <ModCard
                key={m.id}
                mod={m}
                onSelect={handleSelectMod}
                onLike={handleLikeMod}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-500 py-8 text-xs text-center space-y-2">
        <div className="flex items-center justify-center gap-2 font-mono text-slate-400">
          <span className="font-bold text-emerald-400">ModsMap.com</span>
          <span>|</span>
          <span>游戏 Mod 自动采集与推送到前台系统</span>
          <span>|</span>
          <span className="text-indigo-400">ARM VPS 优化版本</span>
        </div>
        <p className="text-slate-600">
          支持全自动采集 NexusMods、CurseForge、Steam 工坊 RSS 数据，© 2026 ModsMap. All rights reserved.
        </p>
      </footer>

      {/* Detail Modal */}
      <ModDetailModal
        mod={selectedMod}
        onClose={() => setSelectedMod(null)}
        onLike={handleLikeMod}
        onAddComment={handleAddComment}
        comments={modComments}
      />

      {/* Scraper Control Drawer */}
      <AutoScraperDrawer
        isOpen={isScraperOpen}
        onClose={() => setIsScraperOpen(false)}
        stats={stats}
        sources={sources}
        logs={logs}
        onToggleAutoCollect={handleToggleAutoCollect}
        onTriggerCustomScrape={(g, k) => handleTriggerScrape(g, k)}
        isScraping={isScraping}
      />

      {/* ARM VPS Deployment Modal */}
      <ArmDeployModal
        isOpen={isArmDeployOpen}
        onClose={() => setIsArmDeployOpen(false)}
      />

      {/* Realtime Live Push Toast */}
      <LivePushToast
        mod={latestPushedMod}
        onSelect={handleSelectMod}
        onDismiss={() => setLatestPushedMod(null)}
      />

    </div>
  );
}
