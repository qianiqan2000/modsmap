import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cpu, 
  Globe, 
  Terminal, 
  Copy, 
  Check, 
  ShieldCheck, 
  Server, 
  Layers, 
  Download,
  ExternalLink
} from 'lucide-react';

interface ArmDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArmDeployModal: React.FC<ArmDeployModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [deployData, setDeployData] = useState<{
    dockerComposeYaml: string;
    nginxConf: string;
    bashScript: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/deploy/arm-script')
      .then((r) => r.json())
      .then((data) => setDeployData(data))
      .catch((e) => console.error('Failed to load ARM deploy script:', e));
  }, []);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl text-slate-100 overflow-hidden my-8 relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100 flex items-center gap-2">
                ARM VPS 生产环境一键部署指南 (modsmap.com)
              </h2>
              <p className="text-xs text-indigo-300 font-mono">
                域名: modsmap.com | 架构: ARM64 / aarch64 (Ampere / Graviton)
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

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Quick Info Box */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Server className="w-4 h-4" />
              <span>ARM VPS 适配调优要点</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              针对 ARM64 (aarch64) 架构的 VPS (如甲骨文ARM、腾讯云/阿里云ARM实例、AWS Graviton)，已完成底层 Docker 容器构建适配、Express 与 Vite 静态化构建捆绑、以及 Nginx SSE (Server-Sent Events) 实时推流无缓存配置。
            </p>
          </div>

          {/* Section 1: One line Bash deploy script */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-2 text-sm">
                <Terminal className="w-4 h-4 text-emerald-400" />
                方案 A: 一键 Bash 自动安装部署脚本 (推荐)
              </span>
              {deployData && (
                <button
                  onClick={() => handleCopy('bash', deployData.bashScript)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedKey === 'bash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'bash' ? '已复制脚本' : '复制 Bash 脚本'}</span>
                </button>
              )}
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 overflow-x-auto">
              <pre>{deployData?.bashScript || '加载部署脚本中...'}</pre>
            </div>
          </div>

          {/* Section 2: Docker Compose YAML */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-2 text-sm">
                <Layers className="w-4 h-4 text-cyan-400" />
                方案 B: docker-compose.yml 配置文件
              </span>
              {deployData && (
                <button
                  onClick={() => handleCopy('docker', deployData.dockerComposeYaml)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedKey === 'docker' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'docker' ? '已复制 YAML' : '复制 Docker Compose'}</span>
                </button>
              )}
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48">
              <pre>{deployData?.dockerComposeYaml || '加载中...'}</pre>
            </div>
          </div>

          {/* Section 3: Nginx SSL Configuration for modsmap.com */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-indigo-400" />
                Nginx 反向代理与 SSL (modsmap.com) 配置
              </span>
              {deployData && (
                <button
                  onClick={() => handleCopy('nginx', deployData.nginxConf)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedKey === 'nginx' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'nginx' ? '已复制 Nginx 配置' : '复制 Nginx 配置'}</span>
                </button>
              )}
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48">
              <pre>{deployData?.nginxConf || '加载中...'}</pre>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
