import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Zap, 
  Settings, 
  Terminal, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Radio, 
  Layers, 
  Database,
  Search,
  Sparkles
} from 'lucide-react';
import { CollectorSource, ScrapeLogEntry, SystemStats } from '../types';

interface AutoScraperDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stats: SystemStats | null;
  sources: CollectorSource[];
  logs: ScrapeLogEntry[];
  onToggleAutoCollect: (enabled: boolean, interval: number) => void;
  onTriggerCustomScrape: (game: string, keyword: string) => void;
  isScraping: boolean;
}

export const AutoScraperDrawer: React.FC<AutoScraperDrawerProps> = ({
  isOpen,
  onClose,
  stats,
  sources,
  logs,
  onToggleAutoCollect,
  onTriggerCustomScrape,
  isScraping
}) => {
  if (!isOpen) return null;

  const [selectedGame, setSelectedGame] = useState('黑神话：悟空');
  const [customKeyword, setCustomKeyword] = useState('');
  const [intervalChoice, setIntervalChoice] = useState(stats?.collectIntervalMinutes || 3);
  const [autoEnabled, setAutoEnabled] = useState(stats?.autoCollectEnabled ?? true);

  const gamesOptions = [
    '黑神话：悟空', '赛博朋克 2077', '艾尔登法环', '上古卷轴5',
    '我的世界', '幻兽帕鲁', 'GTA V', '星露谷物语'
  ];

  const handleApplyConfig = () => {
    onToggleAutoCollect(autoEnabled, intervalChoice);
  };

  const handleStartScrape = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerCustomScrape(selectedGame, customKeyword);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      <div 
        className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full flex flex-col text-slate-100 shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100 flex items-center gap-2">
                Mod 自动采集与推送到前台引擎
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                域名: modsmap.com | 节点: ARM64
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Drawer Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Section 1: Auto-Collect Master Control & Interval */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-bold text-sm text-slate-200 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  定时全自动采集推送任务
                </span>
                <p className="text-xs text-slate-400">
                  开启后将在后台自动监控并拉取最新热门 Mod 直推前台
                </p>
              </div>

              <button
                onClick={() => {
                  const next = !autoEnabled;
                  setAutoEnabled(next);
                  onToggleAutoCollect(next, intervalChoice);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                  autoEnabled
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {autoEnabled ? <Play className="w-3.5 h-3.5 fill-slate-950" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{autoEnabled ? '自动采集已开启' : '采集已暂停'}</span>
              </button>
            </div>

            {/* Frequency Selection */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">自动采集推轮询频率:</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 5, 10].map((min) => (
                  <button
                    key={min}
                    onClick={() => {
                      setIntervalChoice(min);
                      onToggleAutoCollect(autoEnabled, min);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-mono transition-all ${
                      intervalChoice === min
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                        : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                    }`}
                  >
                    {min}分钟
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Trigger Instant Custom Game/Keyword Scrape */}
          <form onSubmit={handleStartScrape} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              指定游戏/关键词 立即AI采集推送
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">目标游戏</label>
                <select
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {gamesOptions.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">关键词 (可选)</label>
                <input
                  type="text"
                  placeholder="例: 光追、无缝联机、飞行AV..."
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isScraping}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 disabled:opacity-50 transition-all"
            >
              <Zap className={`w-4 h-4 ${isScraping ? 'animate-spin' : ''}`} />
              <span>{isScraping ? '智能采集与摘要生成中...' : '立即采集并自动推送到前台'}</span>
            </button>
          </form>

          {/* Section 3: Active Source Feeds */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-200 text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                已挂载的自动化采集数据源 (Feeds)
              </span>
              <span className="text-xs text-slate-400 font-normal">{sources.length} 个数据源</span>
            </h3>

            <div className="space-y-2">
              {sources.map((s) => (
                <div key={s.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      {s.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono truncate max-w-xs">
                      {s.feedUrl}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
                      已抓取: {s.totalCollected}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-1">
                      上次: {s.lastRunTime?.split(' ')[1] || '刚刚'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Realtime Collector Log Stream Terminal */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              采集引擎实时运行控制台日志
            </h3>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs space-y-2 max-h-60 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-slate-600 text-center py-4">等待日志推送...</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-slate-500 text-[10px] shrink-0 mt-0.5">[{log.timestamp}]</span>
                    <span className={`text-[11px] ${
                      log.level === 'success' ? 'text-emerald-400' :
                      log.level === 'warning' ? 'text-amber-400' :
                      log.level === 'error' ? 'text-red-400' : 'text-slate-300'
                    }`}>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
