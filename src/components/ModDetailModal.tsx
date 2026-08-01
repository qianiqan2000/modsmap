import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ThumbsUp, 
  Star, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  User, 
  Layers, 
  HardDrive, 
  MessageSquare, 
  Send,
  Copy,
  Check
} from 'lucide-react';
import { ModItem } from '../types';

interface ModDetailModalProps {
  mod: ModItem | null;
  onClose: () => void;
  onLike: (id: string) => void;
  onAddComment: (modId: string, author: string, content: string) => void;
  comments: any[];
}

export const ModDetailModal: React.FC<ModDetailModalProps> = ({
  mod,
  onClose,
  onLike,
  onAddComment,
  comments
}) => {
  if (!mod) return null;

  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mod.downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(mod.id, authorName || '热心玩家', commentText);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl text-slate-100 overflow-hidden my-8 relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold text-xs">
              {mod.game}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ID: {mod.id}
            </span>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Main Title & Action Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-2xl font-black text-slate-100 leading-tight">
                {mod.title}
              </h2>
              {mod.originalTitle && (
                <p className="text-xs text-slate-400 font-mono">
                  英文原名: {mod.originalTitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-slate-300">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  作者: {mod.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  更新: {new Date(mod.updatedAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                  容量: {mod.fileSize || '微量'}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  版本: {mod.version}
                </span>
              </div>
            </div>

            {/* Direct Download & Original Link Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <a
                href={mod.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>一键下载 Mod 压缩包</span>
              </a>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '已复制链接' : '复制下载链'}</span>
                </button>

                <a
                  href={mod.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>访问源站</span>
                </a>
              </div>
            </div>
          </div>

          {/* Screenshot Showcase */}
          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 max-h-80">
            <img 
              src={mod.coverUrl} 
              alt={mod.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* AI Feature Summary Banner */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>ModsMap 智能引擎精炼摘要与核心亮点</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {mod.description}
            </p>
          </div>

          {/* Grid Section: Requirements & Install Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Requirements & Compatibility */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                前置组件与运行环境要求
              </h3>
              
              <ul className="space-y-2 text-xs text-slate-300">
                {mod.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">安全风险级别:</span>
                <span className="px-2.5 py-0.5 rounded font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {mod.riskLevel || 'Safe'} (已扫描)
                </span>
              </div>
            </div>

            {/* Right: Step-by-Step Installation Guide */}
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                一步步安装部署教程
              </h3>

              <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                {mod.installGuide.map((step, idx) => (
                  <li key={idx} className="pl-1">
                    <span className="text-slate-200 font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

          </div>

          {/* User Comments Section */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                玩家讨论与兼容性反馈 ({comments.length})
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="您的昵称 (可选)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-1/3 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  placeholder="分享您的体验或使用反馈..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  发送
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  暂无讨论，快来发表第一条反馈吧！
                </div>
              ) : (
                comments.map((c: any) => (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-start gap-3">
                    <img src={c.avatar} alt={c.author} className="w-7 h-7 rounded-full object-cover shrink-0" />
                    <div className="flex-1 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-semibold text-slate-200">{c.author}</span>
                        <span>{c.createdAt}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{c.content}</p>
                    </div>
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
