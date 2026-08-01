import React from 'react';
import { 
  Bot, 
  Activity, 
  Download, 
  Cpu, 
  Globe, 
  Radio, 
  Sparkles, 
  ArrowUpRight,
  Database
} from 'lucide-react';
import { SystemStats } from '../types';

interface StatsBannerProps {
  stats: SystemStats | null;
  selectedGame: string;
  setSelectedGame: (g: string) => void;
  gamesList: string[];
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  categoriesList: string[];
  totalModsCount: number;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  stats,
  selectedGame,
  setSelectedGame,
  gamesList,
  selectedCategory,
  setSelectedCategory,
  categoriesList,
  totalModsCount
}) => {
  return (
    <div className="bg-slate-900/60 border-b border-slate-800 text-slate-200 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Info Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Card 1: Domain & Collector */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3 shadow-lg">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">服务域名与节点</div>
              <div className="text-base font-bold text-slate-100 font-mono">
                modsmap.com
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                实时自动推送就绪
              </div>
            </div>
          </div>

          {/* Card 2: Total Mods Index */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3 shadow-lg">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">自动采集已入库 Mod</div>
              <div className="text-xl font-black text-slate-100 font-mono">
                {totalModsCount} <span className="text-xs font-normal text-slate-400">个模组</span>
              </div>
              <div className="text-[11px] text-cyan-400 mt-0.5">
                覆盖 {gamesList.length} 款热门游戏
              </div>
            </div>
          </div>

          {/* Card 3: Auto Collector Engine */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3 shadow-lg">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">采集频率 / 抓取引擎</div>
              <div className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs">
                  每 {stats?.collectIntervalMinutes || 3} 分钟自动采集
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                适配 Nexus / CurseForge / Steam RSS
              </div>
            </div>
          </div>

          {/* Card 4: ARM VPS System Spec */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3 shadow-lg">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">后端运行环境 (ARM VPS)</div>
              <div className="text-sm font-bold text-slate-100 font-mono">
                {stats?.armCpuArch || 'aarch64'} | 内存: {stats?.armMemoryUsageMb || 42}MB
              </div>
              <div className="text-[11px] text-indigo-300 mt-0.5">
                已调优 Docker & Nginx 反向代理
              </div>
            </div>
          </div>

        </div>

        {/* Game Filters Chips */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              游戏分类探索
            </span>
            <span>筛选已采集游戏</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedGame('全部')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all ${
                selectedGame === '全部'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              🎮 全部游戏 ({totalModsCount})
            </button>

            {gamesList.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGame(g)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all ${
                  selectedGame === g
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 mr-2">Mod 类型:</span>
          <button
            onClick={() => setSelectedCategory('全部')}
            className={`px-3 py-1 text-xs rounded-lg transition-all ${
              selectedCategory === '全部'
                ? 'bg-slate-200 text-slate-950 font-semibold'
                : 'bg-slate-800/50 hover:bg-slate-700/80 text-slate-400 border border-slate-700/50'
            }`}
          >
            全部类型
          </button>
          {categoriesList.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                selectedCategory === c
                  ? 'bg-slate-200 text-slate-950 font-semibold'
                  : 'bg-slate-800/50 hover:bg-slate-700/80 text-slate-400 border border-slate-700/50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
