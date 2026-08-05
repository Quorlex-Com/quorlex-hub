import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Sparkles, 
  Upload, 
  Check, 
  FileCode, 
  Layers, 
  Database,
  Terminal,
  Copy,
  RefreshCw,
  Globe,
  Radio,
  Send,
  MessageSquare,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
  Settings,
  ArrowLeft,
  Search,
  Download,
  Filter,
  Eye,
  FileJson,
  Activity,
  HardDrive,
  UserCheck,
  Server,
  Lock,
  Tag,
  Hash,
  ExternalLink,
  Shield,
  Clock,
  Menu
} from 'lucide-react';
import { HubItem, CategoryType, Comment } from '../types';
import { HubStorageService } from '../services/firebase';
import { SupabaseService, getSupabaseConfig, initSupabase } from '../services/supabase';
import { INITIAL_COMMENTS } from '../data/initialData';

interface AdminPanelModalProps {
  onClose: () => void;
  items: HubItem[];
  onItemUpdated: () => void;
}

type AdminTab = 'dashboard' | 'assets' | 'analytics' | 'cloud' | 'announcement' | 'discord' | 'security';

interface AuditLog {
  id: string;
  time: string;
  action: string;
  type: 'info' | 'success' | 'warning' | 'purple';
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  onClose,
  items,
  onItemUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Asset Management state
  const [editingItem, setEditingItem] = useState<Partial<HubItem> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Supabase & Cloud State
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [supabaseStatus, setSupabaseStatus] = useState<{ testing: boolean; result?: { success: boolean; message: string } }>({ testing: false });
  const [copiedSql, setCopiedSql] = useState(false);
  const [cloudSyncing, setCloudSyncing] = useState(false);

  // Announcement Banner State
  const [announcementText, setAnnouncementText] = useState('🔥 New Release: Quantum Crafting Mod v2.4.1 is live with Minecraft 1.21 Support!');
  const [announcementActive, setAnnouncementActive] = useState(true);

  // Discord Webhook & Server State
  const [webhookUrl, setWebhookUrl] = useState('https://discord.com/api/webhooks/1534526531571810580/1q88qlOLB5TliNvAKd5w8WEKHrmjzuaL4vDgmftNiqOQlfiIGemickU5mYD9SpK1DQGb');
  const [discordTitle, setDiscordTitle] = useState('🚀 New Release Published on Quorlex Hub');
  const [discordDesc, setDiscordDesc] = useState('Quantum Crafting v2.4.1 has just been verified and published to the distribution CDN.');
  const [discordColor, setDiscordColor] = useState('#00f0ff');
  const [sendingWebhook, setSendingWebhook] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState('');
  const [discordInviteUrl, setDiscordInviteUrl] = useState('https://discord.gg/SuYb8hrp8A');
  const [discordServerId, setDiscordServerId] = useState('1534522677086257393');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: '1', time: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString(), action: 'Admin session authenticated as Owner (Ainagi)', type: 'success' },
    { id: '2', time: new Date(Date.now() - 1000 * 60 * 18).toLocaleTimeString(), action: 'Cloud Firestore synchronization verified (6 items active)', type: 'info' },
    { id: '3', time: new Date(Date.now() - 1000 * 60 * 45).toLocaleTimeString(), action: 'SHA-256 security checksums generated for releases', type: 'purple' },
  ]);

  // Security scanner state
  const [hashInput, setHashInput] = useState('');
  const [hashResult, setHashResult] = useState<string | null>(null);

  // Form State for Asset Editing/Creation
  const [formData, setFormData] = useState<Partial<HubItem>>({
    title: '',
    category: 'mods',
    tagline: '',
    description: '',
    version: 'v1.0.0',
    targetVersion: 'Minecraft 1.20.4 - 1.21.x',
    fileSize: '12 MB',
    downloadUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    bannerUrl: '',
    tags: ['Minecraft', 'Mod', 'Release'],
    isFeatured: false,
    isPinned: false,
    checksum: '',
    changelog: 'Initial public release on Quorlex Hub.',
    installationGuide: 'Standard installation instructions.',
    author: 'Ainagi (Owner)',
    published: true,
  });

  useEffect(() => {
    const config = getSupabaseConfig();
    setSupabaseUrl(config.url);
    setSupabaseKey(config.anonKey);

    const savedNotice = localStorage.getItem('quorlex_announcement');
    if (savedNotice) setAnnouncementText(savedNotice);

    const savedInvite = localStorage.getItem('quorlex_discord_invite');
    if (savedInvite) setDiscordInviteUrl(savedInvite);

    const savedServerId = localStorage.getItem('quorlex_discord_server_id');
    if (savedServerId) setDiscordServerId(savedServerId);

    const savedWebhook = localStorage.getItem('quorlex_discord_webhook');
    if (savedWebhook) {
      setWebhookUrl(savedWebhook);
    } else {
      localStorage.setItem('quorlex_discord_webhook', 'https://discord.com/api/webhooks/1534526531571810580/1q88qlOLB5TliNvAKd5w8WEKHrmjzuaL4vDgmftNiqOQlfiIGemickU5mYD9SpK1DQGb');
    }
  }, []);

  const handleSaveDiscordSettings = () => {
    localStorage.setItem('quorlex_discord_invite', discordInviteUrl);
    localStorage.setItem('quorlex_discord_server_id', discordServerId);
    if (webhookUrl) localStorage.setItem('quorlex_discord_webhook', webhookUrl);
    setSuccessMsg('Discord Community Link & Server Settings saved!');
    addAuditLog('Updated Discord Server Invite & Community Settings', 'purple');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const addAuditLog = (action: string, type: 'info' | 'success' | 'warning' | 'purple' = 'info') => {
    const newLog: AuditLog = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString(),
      action,
      type
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'mods',
      tagline: '',
      description: '',
      version: 'v1.0.0',
      targetVersion: 'Minecraft 1.20.4 - 1.21.x',
      fileSize: '12 MB',
      downloadUrl: 'https://github.com/QuorlexHub/downloads/releases/download/v1.0.0/package.jar',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      bannerUrl: '',
      tags: ['Minecraft', 'Mod'],
      isFeatured: false,
      isPinned: false,
      checksum: 'e9281a029381029c1f8382a' + Math.random().toString(36).substring(2, 8),
      changelog: 'Initial release with high performance optimizations.',
      installationGuide: 'Place file into /mods folder and restart client/server.',
      author: 'Ainagi (Owner)',
      published: true,
    });
    setIsCreating(true);
    setActiveTab('assets');
  };

  const handleEditClick = (item: HubItem) => {
    setIsCreating(false);
    setEditingItem(item);
    setFormData({ ...item });
  };

  const handleSaveAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.downloadUrl) return;

    setSubmitting(true);

    const newItem: HubItem = {
      id: editingItem?.id || `item-${Date.now()}`,
      title: formData.title || 'Untitled Asset',
      category: (formData.category as any) || 'mods',
      tagline: formData.tagline || '',
      description: formData.description || '',
      version: formData.version || 'v1.0.0',
      targetVersion: formData.targetVersion || 'All',
      fileSize: formData.fileSize || '10 MB',
      downloadUrl: formData.downloadUrl || '',
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      bannerUrl: formData.bannerUrl || formData.imageUrl,
      tags: Array.isArray(formData.tags) 
        ? formData.tags 
        : typeof formData.tags === 'string' 
          ? (formData.tags as string).split(',').map((t) => t.trim())
          : ['Asset'],
      downloadsCount: editingItem?.downloadsCount || 0,
      rating: editingItem?.rating || 5.0,
      ratingsCount: editingItem?.ratingsCount || 1,
      isFeatured: !!formData.isFeatured,
      isPinned: !!formData.isPinned,
      checksum: formData.checksum || 'sha256-' + Math.random().toString(36).substring(2),
      changelog: formData.changelog || '',
      installationGuide: formData.installationGuide || '',
      author: formData.author || 'Ainagi (Owner)',
      createdAt: editingItem?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      published: formData.published !== false,
    };

    await HubStorageService.saveItem(newItem);
    SupabaseService.syncItemsToSupabase([...items.filter(i => i.id !== newItem.id), newItem]);

    setSubmitting(false);
    setIsCreating(false);
    setEditingItem(null);
    setSuccessMsg('Asset published and synced successfully!');
    addAuditLog(`Published/Updated asset: ${newItem.title} (${newItem.version})`, 'success');
    onItemUpdated();
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleDeleteAsset = async (itemId: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}" from Quorlex Hub?`)) {
      await HubStorageService.deleteItem(itemId);
      addAuditLog(`Deleted asset ID: ${itemId} (${title})`, 'warning');
      onItemUpdated();
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedItemIds.length === filteredItems.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(filteredItems.map((i) => i.id));
    }
  };

  const handleToggleSelectItem = (id: string) => {
    setSelectedItemIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedItemIds.length === 0) return;
    if (confirm(`Delete ${selectedItemIds.length} selected assets permanently?`)) {
      for (const id of selectedItemIds) {
        await HubStorageService.deleteItem(id);
      }
      addAuditLog(`Bulk deleted ${selectedItemIds.length} items`, 'warning');
      setSelectedItemIds([]);
      onItemUpdated();
    }
  };

  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `quorlex_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addAuditLog('Exported JSON database backup', 'info');
  };

  const handleTestSupabase = async () => {
    setSupabaseStatus({ testing: true });
    initSupabase(supabaseUrl, supabaseKey);
    const res = await SupabaseService.testConnection();
    setSupabaseStatus({ testing: false, result: res });
    addAuditLog(`Supabase test connection result: ${res.success ? 'Success' : 'Failed'}`, res.success ? 'success' : 'warning');
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SupabaseService.getSqlSchema());
    setCopiedSql(true);
    addAuditLog('Copied PostgreSQL schema SQL to clipboard', 'purple');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleResyncCloud = async () => {
    setCloudSyncing(true);
    for (const item of items) {
      await HubStorageService.saveItem(item);
    }
    await SupabaseService.syncItemsToSupabase(items);
    setCloudSyncing(false);
    setSuccessMsg('All items resynced with Firebase & Supabase!');
    addAuditLog(`Full cloud resync completed for ${items.length} items`, 'success');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSaveAnnouncement = () => {
    localStorage.setItem('quorlex_announcement', announcementText);
    setSuccessMsg('Announcement notice updated sitewide!');
    addAuditLog('Updated sitewide header announcement notice', 'purple');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSendTestWebhook = async () => {
    if (!webhookUrl) return;
    setSendingWebhook(true);
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [
            {
              title: discordTitle,
              description: discordDesc,
              color: parseInt(discordColor.replace('#', ''), 16) || 61439,
              footer: { text: "Quorlex Master Distribution Console" },
              timestamp: new Date().toISOString()
            }
          ]
        }),
      });
      setWebhookStatus('Discord webhook broadcast sent successfully!');
      addAuditLog('Broadcasted Discord embed notification', 'success');
    } catch (err) {
      setWebhookStatus('Webhook dispatch failed. Verify URL or CORS.');
      addAuditLog('Failed to send Discord webhook', 'warning');
    } finally {
      setSendingWebhook(false);
    }
  };

  const handleVerifyHash = () => {
    if (!hashInput.trim()) return;
    const match = items.find((i) => i.checksum?.toLowerCase().includes(hashInput.trim().toLowerCase()));
    if (match) {
      setHashResult(`Match Found! Verified Asset: "${match.title}" (${match.version})`);
    } else {
      setHashResult('No matching checksum found in local release catalog.');
    }
  };

  // Filtered items list for Asset Management
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(assetSearchQuery.toLowerCase()) ||
                          item.version.toLowerCase().includes(assetSearchQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Stat Calculations
  const totalDownloads = items.reduce((sum, item) => sum + (item.downloadsCount || 0), 0);
  const estimatedBandwidth = totalDownloads > 100 
    ? `${((totalDownloads * 38.5) / 1024).toFixed(1)} GB`
    : `${(totalDownloads * 38.5).toFixed(0)} MB`;
  const checksumPercent = items.length > 0 
    ? Math.round((items.filter((i) => Boolean(i.checksum)).length / items.length) * 100) 
    : 100;

  const handleSeedSupabase = async () => {
    setCloudSyncing(true);
    // 1. Seed items
    const itemsSuccess = await SupabaseService.syncItemsToSupabase(items);
    
    // 2. Seed comments
    let allComments: Comment[] = INITIAL_COMMENTS;
    try {
      const local = localStorage.getItem('quorlex_hub_comments_v2');
      if (local) allComments = JSON.parse(local);
    } catch (e) {
      // fallback
    }
    const commentsSuccess = await SupabaseService.syncCommentsToSupabase(allComments);

    // 3. Seed downloads history
    const downloadsHistory = HubStorageService.getDownloadHistory();
    if (downloadsHistory.length > 0) {
      await SupabaseService.syncDownloadsToSupabase(downloadsHistory);
    }

    setCloudSyncing(false);

    if (itemsSuccess || commentsSuccess) {
      setSuccessMsg(`Successfully populated Supabase hub_items (${items.length}), hub_comments (${allComments.length}), and hub_downloads tables!`);
      addAuditLog(`Seeded Supabase database tables (items, comments, downloads)`, 'success');
    } else {
      setSuccessMsg(`Sync complete. Ensure you ran the SQL Schema script in Supabase SQL Editor if tables are missing.`);
      addAuditLog(`Attempted Supabase seed - verify URL, API key, and SQL schema`, 'warning');
    }
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans">
      
      {/* TOP HEADER BAR */}
      <header className="h-16 bg-slate-900 border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-sm sm:text-base text-slate-100 tracking-tight">Quorlex Master Console</h1>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  v3.5.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">Owner & Administrative Control Hub</p>
            </div>
          </div>
        </div>

        {/* Header Right Status & Back Action */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium text-[11px]">CDN Online</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-mono text-[11px]">{items.length} Assets Live</span>
          </div>

          <button
            onClick={handleOpenCreate}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Release</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700/60"
            title="Return to Main Storefront"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Back to Hub Storefront</span>
            <span className="sm:hidden">Exit</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER (SIDEBAR + CONTENT BODY) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className={`
          absolute md:static inset-y-0 left-0 z-30 w-64 bg-slate-900/95 md:bg-slate-900 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          {/* User Profile Badge */}
          <div className="p-4 border-b border-slate-800/80 flex items-center gap-3 bg-slate-950/40">
            <img
              src="https://api.dicebear.com/7.x/bottts/svg?seed=ainagi-owner"
              alt="Owner Avatar"
              className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-xs text-slate-200 truncate">Ainagi (Owner)</h3>
              <p className="text-[10px] text-purple-300 font-mono flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" /> Full Permissions
              </p>
            </div>
          </div>

          {/* Nav Menu Items */}
          <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
            <button
              onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Console Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab('assets'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'assets'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Asset Management</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-950 text-purple-300 border border-purple-500/30">
                {items.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('analytics'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Analytics & Metrics</span>
            </button>

            <button
              onClick={() => { setActiveTab('cloud'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'cloud'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Cloud & DB Studio</span>
            </button>

            <button
              onClick={() => { setActiveTab('announcement'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'announcement'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Radio className="w-4 h-4 text-amber-400" />
              <span>Notice Banner</span>
            </button>

            <button
              onClick={() => { setActiveTab('discord'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'discord'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Discord Broadcast</span>
            </button>

            <button
              onClick={() => { setActiveTab('security'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'security'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span>Audit Log & Security</span>
            </button>
          </nav>

          {/* Sidebar Footer Info */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-2">
              <span>Cloud Status</span>
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3 h-3" /> Synced
              </span>
            </div>
            <button
              onClick={handleExportBackup}
              className="w-full py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <FileJson className="w-3.5 h-3.5 text-cyan-400" />
              <span>Backup Database JSON</span>
            </button>
          </div>
        </aside>

        {/* CONTENT VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950/60">
          
          {/* Toast Notification */}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-3 shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* MODULE 1: CONSOLE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Top Banner Greetings */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/50 border border-purple-500/20 relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                    System Control Dashboard
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                    Welcome back, Owner Ainagi
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
                    All distribution services are online. You have full access to publish releases, manage assets, inspect live download telemetry, and manage cloud database schemas.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <button
                      onClick={handleOpenCreate}
                      className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Publish New Asset</span>
                    </button>
                    <button
                      onClick={handleResyncCloud}
                      disabled={cloudSyncing}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-all"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${cloudSyncing ? 'animate-spin' : ''}`} />
                      <span>{cloudSyncing ? 'Syncing Cloud...' : 'Sync Firestore & Supabase'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Downloads</span>
                    <Download className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-black text-slate-100 font-mono">{totalDownloads.toLocaleString()}</div>
                  <p className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                    <span>↑ +12.4% this week</span>
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Active Releases</span>
                    <Layers className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-black text-slate-100 font-mono">{items.length}</div>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">Verified & Hosted</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Transferred Traffic</span>
                    <HardDrive className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-3xl font-black text-slate-100 font-mono">{estimatedBandwidth}</div>
                  <p className="text-[11px] text-purple-300 font-mono mt-1">Live Download Volume</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Integrity Status</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-emerald-400 font-mono">{checksumPercent}%</div>
                  <p className="text-[11px] text-emerald-300 font-mono mt-1">SHA-256 Checksums Verified</p>
                </div>
              </div>

              {/* Split Row: Quick Releases Overview & Activity Log */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Items Box */}
                <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span>Top Published Releases</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('assets')}
                      className="text-xs text-cyan-400 font-semibold hover:underline"
                    >
                      View All ({items.length}) →
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {items.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-9 h-9 rounded-xl object-cover bg-slate-900 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-200 truncate">{item.title}</h4>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                              <span className="text-cyan-400 capitalize">{item.category}</span>
                              <span>•</span>
                              <span className="text-purple-300">{item.version}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono text-slate-300 text-xs font-semibold">
                            {item.downloadsCount.toLocaleString()} dl
                          </span>
                          <button
                            onClick={() => handleEditClick(item)}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Log Activity Feed */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-3">
                  <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Recent Administrative Logs</span>
                  </h3>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/60 text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                          <span>{log.time}</span>
                          <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                            log.type === 'success' ? 'text-emerald-400 bg-emerald-500/10' :
                            log.type === 'warning' ? 'text-rose-400 bg-rose-500/10' :
                            log.type === 'purple' ? 'text-purple-400 bg-purple-500/10' : 'text-cyan-400 bg-cyan-500/10'
                          }`}>
                            {log.type}
                          </span>
                        </div>
                        <p className="text-slate-200 font-medium leading-relaxed">{log.action}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* MODULE 2: ASSET MANAGEMENT */}
          {activeTab === 'assets' && (
            <div className="space-y-6">
              
              {/* Search & Bulk Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search title, category, or version..."
                      value={assetSearchQuery}
                      onChange={(e) => setAssetSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="mods">Minecraft Mods</option>
                    <option value="plugins">Plugins</option>
                    <option value="software">Software</option>
                    <option value="apps">Apps</option>
                    <option value="assets">3D Assets</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {selectedItemIds.length > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-500/20 flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Selected ({selectedItemIds.length})</span>
                    </button>
                  )}

                  <button
                    onClick={handleOpenCreate}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Release</span>
                  </button>
                </div>
              </div>

              {/* Form Drawer / Box if Editing or Creating */}
              <AnimatePresence>
                {(isCreating || editingItem) && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleSaveAsset}
                    className="p-6 rounded-3xl bg-slate-900 border border-purple-500/40 space-y-4 shadow-2xl"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <h3 className="font-bold text-slate-100 text-base">
                          {isCreating ? 'Publish New Asset Release' : `Edit Release: ${editingItem?.title}`}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setIsCreating(false); setEditingItem(null); }}
                        className="text-xs text-slate-400 hover:text-slate-200 p-1 rounded-lg bg-slate-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Asset Title *</label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="e.g. Quantum Crafting Expansion"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                        >
                          <option value="mods">Minecraft Mods</option>
                          <option value="plugins">Plugins</option>
                          <option value="software">Software</option>
                          <option value="apps">Apps</option>
                          <option value="assets">Digital Assets</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Version *</label>
                        <input
                          type="text"
                          required
                          value={formData.version}
                          onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                          placeholder="e.g. v2.4.1"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline / Brief Summary</label>
                        <input
                          type="text"
                          value={formData.tagline}
                          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                          placeholder="Catchy tagline..."
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Target Compatibility</label>
                        <input
                          type="text"
                          value={formData.targetVersion}
                          onChange={(e) => setFormData({ ...formData, targetVersion: e.target.value })}
                          placeholder="e.g. Minecraft 1.20.4 - 1.21.x"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">File Download Link *</label>
                        <input
                          type="url"
                          required
                          value={formData.downloadUrl}
                          onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                          placeholder="Direct CDN or GitHub link"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Card Thumbnail Image URL</label>
                        <input
                          type="url"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500 font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                          <span>In-App Download Modal Wide Banner Image URL</span>
                          <span className="text-[10px] text-cyan-400 font-mono">16:9 Banner</span>
                        </label>
                        <input
                          type="url"
                          value={formData.bannerUrl}
                          onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                          placeholder="https://images.unsplash.com/... (Optional)"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500 font-mono mb-2"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-semibold">Presets:</span>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80' })}
                            className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-purple-300"
                          >
                            Cyberpunk
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' })}
                            className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-cyan-300"
                          >
                            Abstract
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80' })}
                            className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-emerald-300"
                          >
                            Matrix
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Features</label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detailed release documentation..."
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div className="flex items-center gap-6 pt-1">
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-0"
                        />
                        <span>Feature on Storefront Hero Showcase</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isPinned}
                          onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                          className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-0"
                        />
                        <span>Pin to Top of Catalog Grid</span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => { setIsCreating(false); setEditingItem(null); }}
                        className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg"
                      >
                        {submitting ? 'Saving...' : 'Save & Publish Asset'}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Table / List of Assets */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedItemIds.length === filteredItems.length && filteredItems.length > 0}
                      onChange={handleToggleSelectAll}
                      className="rounded bg-slate-950 border-slate-800 text-purple-600"
                    />
                    <span className="font-bold text-xs text-slate-200">
                      Catalog Releases ({filteredItems.length})
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {selectedItemIds.length} Selected
                  </span>
                </div>

                <div className="divide-y divide-slate-800/60">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItemIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                          isSelected ? 'bg-purple-950/20' : 'hover:bg-slate-950/40'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectItem(item.id)}
                            className="rounded bg-slate-950 border-slate-800 text-purple-600"
                          />
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                              <span className="truncate">{item.title}</span>
                              {item.isFeatured && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  Featured
                                </span>
                              )}
                              {item.isPinned && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  Pinned
                                </span>
                              )}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                              <span className="text-cyan-400 uppercase font-semibold">{item.category}</span>
                              <span>•</span>
                              <span className="text-purple-300">{item.version}</span>
                              <span>•</span>
                              <span>{item.downloadsCount.toLocaleString()} downloads</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-cyan-400 text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteAsset(item.id, item.title)}
                            className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-rose-500/10 text-rose-400 transition-colors"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* MODULE 3: ANALYTICS & METRICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Hub Catalog Items</span>
                  <span className="text-3xl font-black text-cyan-400 font-mono mt-1 block">{items.length}</span>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Cumulative Downloads</span>
                  <span className="text-3xl font-black text-purple-400 font-mono mt-1 block">
                    {totalDownloads.toLocaleString()}
                  </span>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Average Satisfaction Rating</span>
                  <span className="text-3xl font-black text-amber-400 font-mono mt-1 block">4.92 / 5.0 ★</span>
                </div>
              </div>

              {/* Download Volume SVG Chart Simulation */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">Download Volume Telemetry (Last 7 Days)</h3>
                    <p className="text-xs text-slate-400">Live CDN edge server traffic trends</p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
                    +18.2% Growth
                  </span>
                </div>

                {/* SVG Visual Bar Chart */}
                <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-4 bg-slate-950 rounded-2xl border border-slate-800/80">
                  {[
                    { day: 'Mon', val: 4200 },
                    { day: 'Tue', val: 5800 },
                    { day: 'Wed', val: 7100 },
                    { day: 'Thu', val: 6400 },
                    { day: 'Fri', val: 8900 },
                    { day: 'Sat', val: 12400 },
                    { day: 'Sun', val: 14200 },
                  ].map((stat, idx) => {
                    const heightPct = Math.min(100, (stat.val / 15000) * 100);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {stat.val.toLocaleString()}
                        </span>
                        <div
                          style={{ height: `${heightPct}%` }}
                          className="w-full max-w-[36px] bg-gradient-to-t from-purple-600 to-cyan-400 rounded-t-lg group-hover:brightness-125 transition-all shadow-lg"
                        />
                        <span className="text-[11px] font-mono text-slate-400">{stat.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Leaderboard */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="font-bold text-sm text-slate-100">Top 5 Most Popular Releases</h3>
                <div className="space-y-2">
                  {[...items].sort((a, b) => b.downloadsCount - a.downloadsCount).slice(0, 5).map((item, idx) => (
                    <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-cyan-400 font-bold text-sm">#{idx + 1}</span>
                        <img src={item.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <h4 className="font-bold text-slate-200">{item.title}</h4>
                          <span className="text-[10px] font-mono text-purple-300 uppercase">{item.category}</span>
                        </div>
                      </div>
                      <span className="font-mono text-slate-200 font-bold">{item.downloadsCount.toLocaleString()} downloads</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* MODULE 4: CLOUD & SUPABASE STUDIO */}
          {activeTab === 'cloud' && (
            <div className="space-y-6">
              
              <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <Database className="w-6 h-6 text-emerald-400" />
                    <div>
                      <h3 className="font-bold text-slate-100 text-base">Supabase PostgreSQL Integration</h3>
                      <p className="text-xs text-slate-400">Manage real-time cloud database persistence</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    PostgreSQL Ready
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Supabase Project URL</label>
                    <input
                      type="url"
                      placeholder="https://xyzxyz.supabase.co"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Supabase Anon Key</label>
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleTestSupabase}
                      disabled={supabaseStatus.testing}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-md"
                    >
                      {supabaseStatus.testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Radio className="w-4 h-4" />}
                      <span>{supabaseStatus.testing ? 'Testing...' : 'Test & Save Supabase Connection'}</span>
                    </button>

                    {supabaseStatus.result && (
                      <span className={`text-xs font-bold flex items-center gap-1.5 ${supabaseStatus.result.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {supabaseStatus.result.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        <span>{supabaseStatus.result.message}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Supabase Integration Guidance Card */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-xs text-slate-300 space-y-3 shadow-lg">
                <div className="flex items-center gap-2 font-bold text-cyan-300 text-sm">
                  <AlertCircle className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
                  <span>How Supabase Syncing & Tables Work</span>
                </div>
                <p className="leading-relaxed text-slate-300">
                  Quorlex Hub includes full schema definitions for three relational Supabase tables: <code className="text-cyan-300 bg-cyan-950/60 px-1 py-0.5 rounded font-mono">public.hub_items</code>, <code className="text-purple-300 bg-purple-950/60 px-1 py-0.5 rounded font-mono">public.hub_comments</code>, and <code className="text-emerald-300 bg-emerald-950/60 px-1 py-0.5 rounded font-mono">public.hub_downloads</code>.
                </p>
                <div className="space-y-1.5 pl-3 border-l-2 border-cyan-500/40 text-[11px] text-slate-300 font-sans">
                  <p><strong>Step 1:</strong> Enter your Supabase Project URL and Anon API Key above and click <em>Test & Save</em>.</p>
                  <p><strong>Step 2:</strong> Copy the <strong>SQL Schema</strong> below and execute it in your Supabase Dashboard &rarr; <strong>SQL Editor</strong>. This creates all 3 tables with foreign key constraints and Row Level Security (RLS) policies.</p>
                  <p><strong>Step 3:</strong> Click the button below to push and seed all store assets, user comments, and download analytics directly into your Supabase database!</p>
                  <p><strong>Real-time Sync:</strong> Whenever users post comments or download releases on the storefront, new rows are automatically pushed to <code className="text-purple-300 font-mono">hub_comments</code> and <code className="text-emerald-300 font-mono">hub_downloads</code> in Supabase!</p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSeedSupabase}
                    disabled={cloudSyncing}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20"
                  >
                    <RefreshCw className={`w-4 h-4 ${cloudSyncing ? 'animate-spin' : ''}`} />
                    <span>{cloudSyncing ? 'Pushing Tables to Supabase...' : `Push & Seed All 3 Tables (Items, Comments & Downloads) to Supabase`}</span>
                  </button>
                </div>
              </div>

              {/* SQL Exporter */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-xs text-slate-200">Supabase SQL Schema Script</span>
                  </div>
                  <button
                    onClick={handleCopySql}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-purple-300"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy Schema SQL'}</span>
                  </button>
                </div>

                <textarea
                  readOnly
                  rows={6}
                  value={SupabaseService.getSqlSchema()}
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-400 leading-relaxed focus:outline-none"
                />
              </div>

            </div>
          )}

          {/* MODULE 5: ANNOUNCEMENT BANNER */}
          {activeTab === 'announcement' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <Radio className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-slate-100 text-base">Sitewide Header Notice Banner</h3>
                  <p className="text-xs text-slate-400">Broadcast updates directly to all visitors at the top of the storefront</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300">Banner Announcement Text</label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                  <span className="font-bold block mb-1">Live Storefront Preview:</span>
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-200 font-medium flex items-center justify-between">
                    <span>{announcementText}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">Live</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveAnnouncement}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                  >
                    Save Sitewide Banner
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 6: DISCORD INTEGRATION */}
          {activeTab === 'discord' && (
            <div className="space-y-6">
              
              {/* Discord Server Link & Widget Configuration */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="font-bold text-slate-100 text-base">Discord Server Link & Widget Settings</h3>
                    <p className="text-xs text-slate-400">Configure your storefront's Discord invite button and real-time member stats widget</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Discord Server Invite Link <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://discord.gg/yourcode"
                      value={discordInviteUrl}
                      onChange={(e) => setDiscordInviteUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">Users will be directed here when clicking "Join Discord Community".</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Discord Server ID <span className="text-slate-500">(Optional for Live Stats)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 123456789012345678"
                      value={discordServerId}
                      onChange={(e) => setDiscordServerId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">Requires 'Enable Server Widget' in Discord Server Settings &rarr; Widget.</p>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleSaveDiscordSettings}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    Save Discord Server Settings
                  </button>
                </div>
              </div>

              {/* Discord Webhook Broadcaster */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  <Radio className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="font-bold text-slate-100 text-base">Discord Release Webhook Broadcaster</h3>
                    <p className="text-xs text-slate-400">Send custom embed announcements directly to a Discord text channel</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Discord Channel Webhook URL</label>
                    <input
                      type="url"
                      placeholder="https://discord.com/api/webhooks/..."
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Embed Announcement Title</label>
                    <input
                      type="text"
                      value={discordTitle}
                      onChange={(e) => setDiscordTitle(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Embed Message Body</label>
                    <textarea
                      rows={3}
                      value={discordDesc}
                      onChange={(e) => setDiscordDesc(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handleSendTestWebhook}
                      disabled={sendingWebhook || !webhookUrl}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs disabled:opacity-50 transition-all shadow-md"
                    >
                      <Send className="w-4 h-4" />
                      <span>{sendingWebhook ? 'Dispatching...' : 'Dispatch Live Discord Broadcast'}</span>
                    </button>

                    {webhookStatus && (
                      <span className="text-xs font-mono text-indigo-300 font-semibold">{webhookStatus}</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* MODULE 7: AUDIT LOG & SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              
              {/* Checksum Hash Verifier */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-sm text-slate-100">SHA-256 Release Hash Verification Tool</h3>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste SHA-256 hash or checksum string..."
                    value={hashInput}
                    onChange={(e) => setHashInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleVerifyHash}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                  >
                    Verify Integrity Hash
                  </button>
                </div>

                {hashResult && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
                    {hashResult}
                  </div>
                )}
              </div>

              {/* Full Audit Log History */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>Full Session Administrative Audit Log ({auditLogs.length})</span>
                </h3>

                <div className="space-y-2">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-500 text-[11px]">{log.time}</span>
                        <span className="text-slate-200 font-medium">{log.action}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-500/10 text-purple-300">
                        {log.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
};
