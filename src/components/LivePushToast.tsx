import React from 'react';
import { Sparkles, ArrowRight, X, Bot, Download } from 'lucide-react';
import { ModItem } from '../types';

interface LivePushToastProps {
  mod: ModItem | null;
  onSelect: (mod: ModItem) => void;
  onDismiss: () => void;
}

export const LivePushToast: React.FC<LivePushToastProps> = ({ mod, onSelect, onDismiss }) => {
  if (!mod) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-emerald-500/50 rounded-2xl shadow-2xl p-4 text-slate-100 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
          <Bot className="w-5 h-5" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            自动采集引擎推送到前台
          </div>
          <h4 className="font-bold text-sm text-slate-100 line-clamp-1">
            {mod.title}
          </h4>
          <p className="text-xs text-slate-400 line-clamp-1">
            游戏: {mod.game} | 作者: {mod.author}
          </p>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => {
                onSelect(mod);
                onDismiss();
              }}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>点此查看详情与一键下载</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-slate-500 hover:text-slate-300 p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
