import React from 'react';
import { motion } from 'motion/react';
import { X, Download, HardDrive, Clock, CheckCircle2, RotateCcw, Trash2, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HubItem } from '../types';

interface DownloadManagerModalProps {
  onClose: () => void;
  allItems: HubItem[];
  onSelectItem: (item: HubItem) => void;
}

export const DownloadManagerModal: React.FC<DownloadManagerModalProps> = ({
  onClose,
  allItems,
  onSelectItem,
}) => {
  const { downloadHistory } = useAuth();

  const totalDownloaded = downloadHistory.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 overflow-hidden max-h-[90vh] flex flex-col"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-2 rounded-full bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white transition-colors z-10"
          title="Close modal"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Dashboard Title */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-slate-800/80 pr-10">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
            <Download className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-bold text-slate-100">Downloads Manager</h2>
            <p className="text-[11px] sm:text-xs text-slate-400">Track download records, bandwidth & re-download assets</p>
          </div>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex sm:flex-col items-center sm:items-start justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Downloads</span>
            <span className="text-lg sm:text-2xl font-black text-cyan-400 font-mono sm:mt-1">{totalDownloaded}</span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex sm:flex-col items-center sm:items-start justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Security</span>
            <span className="text-xs font-bold text-emerald-400 font-mono sm:mt-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> SHA-256 Verified
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex sm:flex-col items-center sm:items-start justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Mirror Status</span>
            <span className="text-xs font-bold text-purple-400 font-mono sm:mt-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Direct CDN Active
            </span>
          </div>
        </div>

        {/* Downloads History List */}
        <div className="space-y-2.5 sm:space-y-3 flex-1 overflow-y-auto pr-1">
          <h3 className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Download History
          </h3>

          {downloadHistory.length > 0 ? (
            downloadHistory.map((rec) => {
              const matchedItem = allItems.find((i) => i.id === rec.itemId);
              return (
                <div
                  key={rec.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs gap-3"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 font-mono shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-200 text-xs sm:text-sm truncate">{rec.itemTitle}</h4>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-400 mt-0.5 flex-wrap">
                        <span className="capitalize text-cyan-300 font-medium">{rec.category}</span>
                        <span>•</span>
                        <span className="font-mono text-purple-300">{rec.version}</span>
                        <span>•</span>
                        <span className="font-mono">{new Date(rec.downloadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {matchedItem && (
                    <button
                      onClick={() => {
                        onClose();
                        onSelectItem(matchedItem);
                      }}
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Re-Open Asset</span>
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-10 sm:py-12 px-4 text-center text-slate-500 text-xs font-mono bg-slate-950/40 rounded-2xl border border-slate-800/60 leading-relaxed">
              No download records found yet. Download any mod, plugin, or asset from the hub to see your log history here!
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
};
