import React from 'react';
import { 
  Download, 
  ThumbsUp, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  ArrowRight,
  Clock,
  MessageSquare
} from 'lucide-react';
import { ModItem } from '../types';

interface ModCardProps {
  mod: ModItem;
  onSelect: (mod: ModItem) => void;
  onLike: (id: string, e: React.MouseEvent) => void;
}

export const ModCard: React.FC<ModCardProps> = ({ mod, onSelect, onLike }) => {
  const platformColor = {
    nexusmods: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    curseforge: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    steam: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    moddb: 'bg-red-500/10 text-red-400 border-red-500/30',
    github: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    rss_custom: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  }[mod.sourcePlatform] || 'bg-slate-700 text-slate-300';

  const platformName = {
    nexusmods: 'NexusMods',
    curseforge: 'CurseForge',
    steam: 'Steam 工坊',
    moddb: 'ModDB',
    github: 'GitHub',
    rss_custom: '自定义 RSS'
  }[mod.sourcePlatform];

  return (
    <div 
      onClick={() => onSelect(mod)}
      className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 shadow-lg hover:shadow-emerald-950/20 transition-all duration-300 flex flex-col overflow-hidden relative"
    >
      {/* Top Media Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img 
          src={mod.coverUrl} 
          alt={mod.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {/* Game Badge */}
          <span className="px-2.5 py-1 text-xs font-bold bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 rounded-lg shadow-md">
            {mod.game}
          </span>

          {/* Source Platform Badge */}
          <span className={`px-2 py-0.5 text-[11px] font-semibold border rounded-lg backdrop-blur-md ${platformColor}`}>
            {platformName}
          </span>
        </div>

        {/* Category & Risk Overlay Tag */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px]">
          <span className="px-2 py-0.5 rounded bg-slate-800/80 backdrop-blur-md text-slate-300 border border-slate-700/60 font-medium">
            {mod.category}
          </span>

          {mod.autoCollected && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/40 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              自动采集推送
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div className="space-y-2">
          {/* Mod Title */}
          <h3 className="font-bold text-slate-100 text-base leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2">
            {mod.title}
          </h3>

          {/* AI Summary Highlight */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {mod.summary || mod.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {mod.tags.slice(0, 3).map((tag, idx) => (
            <span 
              key={idx} 
              className="px-2 py-0.5 text-[10px] bg-slate-800/60 text-slate-400 border border-slate-700/50 rounded-md font-mono"
            >
              #{tag}
            </span>
          ))}
          {mod.tags.length > 3 && (
            <span className="text-[10px] text-slate-500 px-1">+More</span>
          )}
        </div>

        {/* Bottom Metrics Bar */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          
          <div className="flex items-center gap-3">
            {/* Rating */}
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {mod.rating.toFixed(1)}
            </span>

            {/* Downloads */}
            <span className="flex items-center gap-1 text-slate-300 font-mono">
              <Download className="w-3.5 h-3.5 text-slate-400" />
              {mod.downloadsCount > 10000 
                ? `${(mod.downloadsCount / 10000).toFixed(1)}万` 
                : mod.downloadsCount}
            </span>
          </div>

          {/* Likes & Interaction */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onLike(mod.id, e)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <ThumbsUp className="w-3 h-3" />
              <span className="font-mono text-[11px]">{mod.likesCount}</span>
            </button>

            <span className="text-emerald-400 font-medium flex items-center gap-0.5 group-hover:translate-x-1 transition-transform text-xs">
              详情
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
