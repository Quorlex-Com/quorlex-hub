import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ItemGrid } from './components/ItemGrid';
import { ItemDetailModal } from './components/ItemDetailModal';
import { DownloadManagerModal } from './components/DownloadManagerModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { SearchModal } from './components/SearchModal';
import { DiscordWidget } from './components/DiscordWidget';
import { Footer } from './components/Footer';
import { AmbientMeshCanvas } from './components/AmbientMeshCanvas';
import { HubItem, CategoryType, GlobalStats } from './types';
import { INITIAL_STATS } from './data/initialData';
import { HubStorageService } from './services/firebase';

const AppContent: React.FC = () => {
  const { recordDownload, downloadHistory, authErrorNotice, clearAuthErrorNotice } = useAuth();

  const [items, setItems] = useState<HubItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [selectedItem, setSelectedItem] = useState<HubItem | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [downloadsModalOpen, setDownloadsModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Load items
  const reloadItems = async () => {
    const fetched = await HubStorageService.getItems();
    setItems(fetched);
  };

  useEffect(() => {
    reloadItems();
  }, []);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [discordMembers, setDiscordMembers] = useState<number>(INITIAL_STATS.discordMembers);
  const [activeOnline, setActiveOnline] = useState<number>(INITIAL_STATS.activeOnline);

  // Sync live Discord stats
  useEffect(() => {
    const fetchDiscordStats = () => {
      const savedServerId = localStorage.getItem('quorlex_discord_server_id') || '1534522677086257393';
      fetch(`https://discord.com/api/guilds/${savedServerId}/widget.json`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.presence_count !== undefined) {
            const online = data.presence_count;
            const total = data.members && data.members.length > 0 
              ? Math.max(data.members.length, online) 
              : online;
            setDiscordMembers(total);
            setActiveOnline(online);
          }
        })
        .catch(() => {});
    };

    fetchDiscordStats();
    const interval = setInterval(fetchDiscordStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Helper to calculate dynamic bandwidth served
  const calculateBandwidthServed = (hubItems: HubItem[]) => {
    let totalMB = 0;
    hubItems.forEach((item) => {
      const sizeStr = item.fileSize || '0 MB';
      const match = sizeStr.match(/([\d.]+)\s*(KB|MB|GB|TB)?/i);
      if (match) {
        const val = parseFloat(match[1]);
        const unit = (match[2] || 'MB').toUpperCase();
        let mb = val;
        if (unit === 'KB') mb = val / 1024;
        else if (unit === 'GB') mb = val * 1024;
        else if (unit === 'TB') mb = val * 1024 * 1024;
        totalMB += mb * (item.downloadsCount || 0);
      }
    });

    if (totalMB < 1) return '0 MB';
    if (totalMB < 1024) return `${totalMB.toFixed(1)} MB`;
    if (totalMB < 1024 * 1024) return `${(totalMB / 1024).toFixed(2)} GB`;
    return `${(totalMB / (1024 * 1024)).toFixed(2)} TB`;
  };

  // Compute stats
  const totalDownloads = items.reduce((acc, curr) => acc + (curr.downloadsCount || 0), 0) + INITIAL_STATS.totalDownloads;
  const bandwidthServed = calculateBandwidthServed(items);
  const stats: GlobalStats = {
    ...INITIAL_STATS,
    totalDownloads,
    totalAssets: items.length,
    bandwidthServed,
    discordMembers,
    activeOnline,
  };

  // Downloaded item ids set
  const downloadedItemIds = new Set(downloadHistory.map((d) => d.itemId));

  // Quick download from card
  const handleQuickDownload = async (item: HubItem, e: React.MouseEvent) => {
    e.stopPropagation();

    // Trigger confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    // Increment count in DB/storage
    const newCount = await HubStorageService.incrementDownload(item.id);
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, downloadsCount: newCount } : i))
    );

    // Record history
    recordDownload({
      id: `dl-${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      category: item.category,
      version: item.version,
      fileSize: item.fileSize,
      downloadedAt: new Date().toISOString(),
      status: 'completed',
    });

    // Trigger actual download link
    const link = document.createElement('a');
    link.href = item.downloadUrl;
    link.download = `${item.title.replace(/\s+/g, '_')}_${item.version}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCompletedInModal = (item: HubItem) => {
    reloadItems();
    recordDownload({
      id: `dl-${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      category: item.category,
      version: item.version,
      fileSize: item.fileSize,
      downloadedAt: new Date().toISOString(),
      status: 'completed',
    });
  };

  const featuredItems = items.filter((i) => i.isFeatured);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-300 relative">
      
      {/* Interactive Ambient Mesh Lighting Canvas */}
      <AmbientMeshCanvas />

      {/* Top Header Navigation */}
      <Header
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          window.scrollTo({ top: 500, behavior: 'smooth' });
        }}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenDownloads={() => setDownloadsModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Notice Banner for Firebase Auth Domain Configuration */}
      {authErrorNotice && (
        <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 p-4 rounded-2xl flex items-start justify-between gap-3 text-xs sm:text-sm backdrop-blur-md">
            <div className="space-y-1">
              <p className="font-bold text-amber-300">Firebase Auth Domain Configuration Notice</p>
              <p className="text-amber-200/90 leading-relaxed">{authErrorNotice}</p>
            </div>
            <button
              onClick={clearAuthErrorNotice}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold whitespace-nowrap transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main>
        {/* 4D Hero Section */}
        <HeroSection
          stats={stats}
          featuredItems={featuredItems}
          onSelectItem={(item) => setSelectedItem(item)}
          onExploreCategory={(cat) => {
            setActiveCategory(cat);
            window.scrollTo({ top: 550, behavior: 'smooth' });
          }}
        />

        {/* Filtered Asset Grid */}
        <ItemGrid
          items={items}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          onSelectItem={(item) => setSelectedItem(item)}
          onQuickDownload={handleQuickDownload}
          downloadedItemIds={downloadedItemIds}
        />

        {/* Discord Widget */}
        <DiscordWidget />
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={setActiveCategory}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* Modals & Popups */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onDownloadCompleted={handleDownloadCompletedInModal}
          isDownloaded={downloadedItemIds.has(selectedItem.id)}
        />
      )}

      {searchModalOpen && (
        <SearchModal
          onClose={() => setSearchModalOpen(false)}
          items={items}
          onSelectItem={(item) => setSelectedItem(item)}
        />
      )}

      {downloadsModalOpen && (
        <DownloadManagerModal
          onClose={() => setDownloadsModalOpen(false)}
          allItems={items}
          onSelectItem={(item) => setSelectedItem(item)}
        />
      )}

      {adminModalOpen && (
        <AdminPanelModal
          onClose={() => setAdminModalOpen(false)}
          items={items}
          onItemUpdated={reloadItems}
        />
      )}

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
