export type PlatformSource = 'nexusmods' | 'curseforge' | 'steam' | 'moddb' | 'github' | 'rss_custom';

export type RiskLevel = 'Safe' | 'Warning' | 'Needs Core Mod';

export interface ModItem {
  id: string;
  title: string;
  originalTitle: string;
  game: string;
  gameCode: string;
  category: string;
  description: string;
  summary: string;
  version: string;
  author: string;
  sourcePlatform: PlatformSource;
  sourceUrl: string;
  coverUrl: string;
  screenshots: string[];
  downloadUrl: string;
  fileSize?: string;
  tags: string[];
  rating: number; // 0-5
  downloadsCount: number;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  autoCollected: boolean;
  riskLevel: RiskLevel;
  requirements: string[];
  installGuide: string[];
  commentsCount: number;
}

export interface ScrapeJobConfig {
  game: string;
  sourcePlatform: PlatformSource;
  keyword: string;
  autoPublish: boolean;
  minRating: number;
  translateToChinese: boolean;
  generateInstallGuide: boolean;
}

export interface CollectorSource {
  id: string;
  name: string;
  platform: PlatformSource;
  game: string;
  feedUrl: string;
  enabled: boolean;
  lastRunTime?: string;
  totalCollected: number;
}

export interface SystemStats {
  domainName: string;
  totalModsCount: number;
  totalDownloads: number;
  activeCollectorsCount: number;
  autoCollectEnabled: boolean;
  collectIntervalMinutes: number;
  lastScrapeTime: string;
  armCpuArch: string;
  armMemoryUsageMb: number;
  uptimeSeconds: number;
  sseConnectedClients: number;
}

export interface ModComment {
  id: string;
  modId: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface ScrapeLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  modTitle?: string;
}
