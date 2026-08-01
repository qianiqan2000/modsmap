import React from 'react';
import { 
  Bot, 
  Search, 
  Server, 
  Cpu, 
  Globe, 
  Zap, 
  RefreshCw, 
  Settings2, 
  Download, 
  Sparkles,
  Layers
} from 'lucide-react';
import { SystemStats } from '../types';

interface NavbarProps {
  stats: SystemStats | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedGame: string;
  setSelectedGame: (g: string) => void;
  gamesList: string[];
  onOpenScraper: () => void;
  onOpenArmDeploy: () => void;
  onTriggerScrape: () => void;
  isScraping: boolean;
  autoPushCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  searchQuery,
  setSearchQuery,
  selectedGame,
  setSelectedGame,
  gamesList,
  onOpenScraper,
  onOpenArmDeploy,
  onTriggerScrape,
  isScraping,
  autoPushCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Domain Info */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
              <Bot className="w-6 h-6 text-slate-950" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                  ModsMap
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded">
                  modsmap.com
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                游戏 Mod 自动采集与实时推送系统
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="hidden md:flex flex-1 max-w-md items-center relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索游戏、Mod名称、作者或标签 (如: 黑神话、画质、光追)..."
              className="w-full pl-10 pr-4 py-1.5 text-sm bg-slate-800/80 border border-slate-700/80 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 bg-slate-700/50 px-1.5 py-0.5 rounded"
              >
                清除
              </button>
            )}
          </div>

          {/* Action Tools & Status */}
          <div className="flex items-center gap-2.5">
            
            {/* Realtime Scrape Push Trigger Button */}
            <button
              onClick={onTriggerScrape}
              disabled={isScraping}
              title="立即触发一次全网Mod自动采集与前台推送"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-900/30 transition-all active:scale-95 disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 ${isScraping ? 'animate-bounce text-amber-300' : 'text-emerald-200'}`} />
              <span>{isScraping ? '采集推送中...' : '手动一键采集'}</span>
            </button>

            {/* Auto Scraper Control Panel Toggle */}
            <button
              onClick={onOpenScraper}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all relative"
            >
              <Settings2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">采集控制台</span>
              {autoPushCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-full">
                  +{autoPushCount}
                </span>
              )}
            </button>

            {/* ARM VPS Deployment Help Modal */}
            <button
              onClick={onOpenArmDeploy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/50 text-indigo-300 transition-all"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">ARM VPS 部署</span>
            </button>

            {/* Status Pulse */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-slate-950/50 border border-slate-800 rounded-lg text-[11px] text-slate-300">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>ARM64</span>
              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
              <span className="text-emerald-400 font-mono">
                {stats?.autoCollectEnabled ? '自动采集: 运行中' : '自动采集: 暂停'}
              </span>
            </div>

          </div>

        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索Mod关键词、游戏名称或作者..."
              className="w-full pl-10 pr-4 py-1.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
