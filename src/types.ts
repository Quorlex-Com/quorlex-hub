export type CategoryType = 'all' | 'mods' | 'plugins' | 'software' | 'apps' | 'assets';

export interface MirrorLink {
  name: string;
  url: string;
  type: 'direct' | 'curseforge' | 'modrinth' | 'github' | 'mirror';
}

export interface HubItem {
  id: string;
  title: string;
  category: Exclude<CategoryType, 'all'>;
  tagline: string;
  description: string;
  version: string;
  targetVersion: string; // e.g. "Minecraft 1.20.4 - 1.21.x" or "Windows 10/11 & macOS"
  fileSize: string;
  downloadUrl: string;
  imageUrl: string;
  bannerUrl?: string;
  tags: string[];
  downloadsCount: number;
  rating: number;
  ratingsCount: number;
  isFeatured?: boolean;
  isPinned?: boolean;
  checksum?: string;
  changelog?: string;
  installationGuide?: string;
  mirrors?: MirrorLink[];
  author: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export interface Comment {
  id: string;
  itemId: string;
  authorName: string;
  authorAvatar?: string;
  authorUid?: string;
  content: string;
  rating: number;
  upvotes: number;
  createdAt: string;
  isVerifiedDownloader?: boolean;
}

export interface DownloadRecord {
  id: string;
  itemId: string;
  itemTitle: string;
  category: Exclude<CategoryType, 'all'>;
  version: string;
  fileSize: string;
  downloadedAt: string;
  status: 'completed' | 'downloading' | 'failed';
  downloadProgress?: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'release' | 'update' | 'community' | 'system';
  read: boolean;
  linkItemId?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  discordConnected?: boolean;
  discordTag?: string;
}

export interface GlobalStats {
  totalDownloads: number;
  totalAssets: number;
  activeOnline: number;
  discordMembers: number;
  bandwidthServed: string;
}
