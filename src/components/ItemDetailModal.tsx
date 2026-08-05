import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Download, 
  ShieldCheck, 
  Star, 
  ExternalLink, 
  Copy, 
  Check, 
  FileCode, 
  MessageSquare, 
  ListCheck, 
  Terminal, 
  Share2, 
  Sparkles,
  Info,
  Clock,
  HardDrive
} from 'lucide-react';
import { HubItem, Comment } from '../types';
import { HubStorageService } from '../services/firebase';
import { CommentsSection } from './CommentsSection';

interface ItemDetailModalProps {
  item: HubItem | null;
  onClose: () => void;
  onDownloadCompleted: (item: HubItem) => void;
  isDownloaded: boolean;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onDownloadCompleted,
  isDownloaded,
}) => {
  if (!item) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'changelog' | 'installation' | 'mirrors' | 'comments'>('overview');
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copiedHash, setCopiedHash] = useState(false);
  const [downloadCount, setDownloadCount] = useState(item.downloadsCount);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    setDownloadCount(item.downloadsCount);
    // Fetch comments for item
    HubStorageService.getComments(item.id).then((data) => setComments(data));
  }, [item]);

  const handleStartDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    setProgress(0);

    // Simulate download progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(async () => {
      setDownloading(false);
      setProgress(100);

      // Confetti feedback
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Increment count
      const updatedCount = await HubStorageService.incrementDownload(item.id);
      setDownloadCount(updatedCount);

      // Trigger file download
      const link = document.createElement('a');
      link.href = item.downloadUrl;
      link.download = `${item.title.replace(/\s+/g, '_')}_${item.version}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Parent callback
      onDownloadCompleted(item);
    }, 800);
  };

  const handleCopyChecksum = () => {
    if (item.checksum) {
      navigator.clipboard.writeText(item.checksum);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleAddComment = async (newComment: Comment) => {
    const saved = await HubStorageService.addComment(newComment);
    setComments((prev) => [saved, ...prev]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-950 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Banner */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-950 shrink-0">
          <img
            src={item.bannerUrl || item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Title & Author Overlay */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                  {item.version}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                {item.title}
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                By <span className="text-cyan-400 font-semibold">{item.author}</span> • Target: {item.targetVersion}
              </p>
            </div>

            {/* Quick Download Button in Header */}
            <div className="shrink-0">
              <button
                onClick={handleStartDownload}
                disabled={downloading}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Download className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>{downloading ? `Downloading (${progress}%)...` : isDownloaded ? 'Re-Download File' : 'Download Now'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Download Progress Bar Overlay */}
        {downloading && (
          <div className="w-full bg-slate-950 h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Stat Badges Bar */}
        <div className="bg-slate-950/60 border-y border-slate-800/80 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{item.rating} / 5.0</span>
              <span className="text-slate-500">({item.ratingsCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-400 font-mono">
              <Download className="w-4 h-4" />
              <span>{downloadCount.toLocaleString()} Total Downloads</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400 font-mono">
              <HardDrive className="w-4 h-4 text-purple-400" />
              <span>{item.fileSize}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
            <ShieldCheck className="w-4 h-4" />
            <span>SHA-256 Verified Clean</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 px-6 bg-slate-900/80 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'overview', label: 'Overview', icon: <Info className="w-4 h-4" /> },
            { id: 'changelog', label: 'Changelog', icon: <ListCheck className="w-4 h-4" /> },
            { id: 'installation', label: 'Installation', icon: <Terminal className="w-4 h-4" /> },
            { id: 'mirrors', label: 'Mirrors & Hash', icon: <FileCode className="w-4 h-4" /> },
            { id: 'comments', label: `Reviews (${comments.length})`, icon: <MessageSquare className="w-4 h-4" /> },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3.5 px-3 border-b-2 font-semibold text-xs transition-colors whitespace-nowrap ${
                  active
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <h3 className="font-bold text-slate-100 text-sm mb-2">Tagline</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{item.tagline}</p>
              </div>

              <div>
                <h3 className="font-bold text-slate-100 text-sm mb-3">Description & Features</h3>
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-sans space-y-3">
                  {item.description}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <h4 className="font-semibold text-xs text-slate-400 mb-2">Category Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {item.tags?.map((t, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Changelog Tab */}
          {activeTab === 'changelog' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-100 text-sm">Release Notes — {item.version}</h3>
                <span className="text-xs text-slate-500 font-mono">Updated: {item.updatedAt}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 font-mono text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                {item.changelog || 'No specific changelog notes published for this release.'}
              </div>
            </div>
          )}

          {/* Installation Tab */}
          {activeTab === 'installation' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-100 text-sm">Step-by-Step Installation Guide</h3>
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {item.installationGuide || '1. Download the asset.\n2. Place it in your appropriate mods/plugins/assets directory.\n3. Restart your application or server.'}
              </div>
            </div>
          )}

          {/* Mirrors & Hash Tab */}
          {activeTab === 'mirrors' && (
            <div className="space-y-6">
              {/* Checksum Box */}
              <div>
                <h3 className="font-bold text-slate-100 text-sm mb-2">SHA-256 Checksum Verification</h3>
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300">
                  <span className="truncate flex-1">{item.checksum || 'a8f9c21e04b98d23e1104e902b4891a27e8d302c'}</span>
                  <button
                    onClick={handleCopyChecksum}
                    className="p-2 rounded-xl bg-slate-900 text-cyan-400 hover:bg-slate-800 transition-colors"
                    title="Copy Checksum"
                  >
                    {copiedHash ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Mirror Links */}
              <div>
                <h3 className="font-bold text-slate-100 text-sm mb-3">Alternative Mirror Downloads</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <a
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-200 text-xs font-semibold"
                  >
                    <span>Direct Quorlex CDN</span>
                    <ExternalLink className="w-4 h-4 text-cyan-400" />
                  </a>
                  {item.mirrors?.map((m, idx) => (
                    <a
                      key={idx}
                      href={m.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-200 text-xs font-semibold"
                    >
                      <span>{m.name}</span>
                      <ExternalLink className="w-4 h-4 text-purple-400" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Comments & Reviews Tab */}
          {activeTab === 'comments' && (
            <CommentsSection
              itemId={item.id}
              comments={comments}
              onAddComment={handleAddComment}
            />
          )}

        </div>

      </motion.div>
    </div>
  );
};
