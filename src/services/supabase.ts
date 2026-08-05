import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { HubItem, Comment, DownloadRecord } from '../types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

const STORAGE_KEY_URL = 'quorlex_supabase_url';
const STORAGE_KEY_KEY = 'quorlex_supabase_key';

let supabaseClient: SupabaseClient | null = null;

function normalizeSupabaseUrl(url: string): string {
  if (!url) return '';
  let cleaned = url.trim();
  cleaned = cleaned.replace(/\/rest\/v1\/?$/i, '');
  cleaned = cleaned.replace(/\/$/, '');
  return cleaned;
}

export function getSupabaseConfig(): SupabaseConfig {
  const metaEnv = (import.meta as any).env || {};
  let url = localStorage.getItem(STORAGE_KEY_URL) || metaEnv.VITE_SUPABASE_URL || '';
  const anonKey = localStorage.getItem(STORAGE_KEY_KEY) || metaEnv.VITE_SUPABASE_ANON_KEY || '';
  url = normalizeSupabaseUrl(url);
  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && url.startsWith('http')),
  };
}

export function initSupabase(url: string, anonKey: string): SupabaseClient | null {
  const cleanedUrl = normalizeSupabaseUrl(url);
  if (!cleanedUrl || !anonKey || !cleanedUrl.startsWith('http')) return null;

  try {
    localStorage.setItem(STORAGE_KEY_URL, cleanedUrl);
    localStorage.setItem(STORAGE_KEY_KEY, anonKey);
    supabaseClient = createClient(cleanedUrl, anonKey);
    return supabaseClient;
  } catch (err) {
    console.error('Supabase initialization error:', err);
    return null;
  }
}

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;
  const config = getSupabaseConfig();
  if (config.isConfigured) {
    return initSupabase(config.url, config.anonKey);
  }
  return null;
}

export const SupabaseService = {
  async testConnection(): Promise<{ success: boolean; message: string }> {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, message: 'Supabase URL or Anon Key missing.' };
    }

    try {
      // Test simple ping query
      const { data, error } = await client.from('hub_items').select('count', { count: 'exact', head: true });
      if (error && error.code !== 'PGRST116') {
        // Table might not exist yet, attempt simple RPC or fallback
        if (error.message.includes('relation "public.hub_items" does not exist')) {
          return {
            success: true,
            message: 'Connected to Supabase! (Note: Run SQL schema in Supabase Editor to create tables).',
          };
        }
        return { success: false, message: error.message };
      }
      return { success: true, message: 'Connected and synchronized with Supabase database!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Connection failed.' };
    }
  },

  async syncItemsToSupabase(items: HubItem[]): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const formatted = items.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        tagline: item.tagline,
        description: item.description,
        version: item.version,
        target_version: item.targetVersion,
        file_size: item.fileSize,
        download_url: item.downloadUrl,
        image_url: item.imageUrl,
        banner_url: item.bannerUrl || item.imageUrl,
        downloads_count: item.downloadsCount || 0,
        rating: item.rating || 5.0,
        is_featured: !!item.isFeatured,
        is_pinned: !!item.isPinned,
        author: item.author || 'Ainagi',
        checksum: item.checksum || '',
        changelog: item.changelog || '',
        installation_guide: item.installationGuide || '',
        published: item.published !== false,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await client.from('hub_items').upsert(formatted);
      if (error) {
        console.warn('Supabase items sync notice:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase sync error:', e);
      return false;
    }
  },

  async syncCommentsToSupabase(comments: Comment[]): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const formatted = comments.map((c) => ({
        id: c.id,
        item_id: c.itemId,
        author_name: c.authorName,
        author_avatar: c.authorAvatar || '',
        content: c.content,
        rating: c.rating || 5,
        upvotes: c.upvotes || 1,
        created_at: c.createdAt || new Date().toISOString(),
      }));

      const { error } = await client.from('hub_comments').upsert(formatted);
      if (error) {
        console.warn('Supabase comments sync notice:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase comments sync error:', e);
      return false;
    }
  },

  async syncDownloadsToSupabase(downloads: DownloadRecord[]): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const formatted = downloads.map((d) => ({
        id: d.id,
        item_id: d.itemId,
        item_title: d.itemTitle || '',
        category: d.category || '',
        version: d.version || '',
        downloaded_at: d.downloadedAt || new Date().toISOString(),
      }));

      const { error } = await client.from('hub_downloads').upsert(formatted);
      if (error) {
        console.warn('Supabase downloads sync notice:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Supabase downloads sync error:', e);
      return false;
    }
  },

  getSqlSchema(): string {
    return `-- ==========================================
-- QUORLEX HUB SUPABASE DATABASE SCHEMA
-- Execute this SQL in your Supabase SQL Editor
-- ==========================================

CREATE TABLE IF NOT EXISTS public.hub_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  version TEXT DEFAULT 'v1.0.0',
  target_version TEXT,
  file_size TEXT,
  download_url TEXT NOT NULL,
  image_url TEXT,
  banner_url TEXT,
  downloads_count INT DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 5.0,
  is_featured BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  author TEXT DEFAULT 'Ainagi',
  checksum TEXT,
  changelog TEXT,
  installation_guide TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hub_comments (
  id TEXT PRIMARY KEY,
  item_id TEXT REFERENCES public.hub_items(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  rating INT DEFAULT 5,
  upvotes INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hub_downloads (
  id TEXT PRIMARY KEY,
  item_id TEXT REFERENCES public.hub_items(id) ON DELETE CASCADE,
  item_title TEXT,
  category TEXT,
  version TEXT,
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) with Public Read Access
ALTER TABLE public.hub_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hub_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hub_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Items" ON public.hub_items FOR SELECT USING (true);
CREATE POLICY "Public Read Comments" ON public.hub_comments FOR SELECT USING (true);
CREATE POLICY "Public Insert Comments" ON public.hub_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Downloads" ON public.hub_downloads FOR INSERT WITH CHECK (true);
`;
  },
};
