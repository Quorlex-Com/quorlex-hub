import React from 'react';
import { motion } from 'motion/react';
import { Download, ShieldCheck, Star, Sparkles, Pin, Check } from 'lucide-react';
import { Card3D } from './Card3D';
import { HubItem } from '../types';

interface ItemCardProps {
  item: HubItem;
  onClick: () => void;
  onQuickDownload: (e: React.MouseEvent) => void;
  isDownloaded?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onClick,
  onQuickDownload,
  isDownloaded = false,
}) => {
  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'mods': return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'plugins': return 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30';
      case 'software': return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'apps': return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'assets': return 'bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30';
      default: return 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <Card3D onClick={onClick} className="group h-full">
      <div className="relative flex flex-col justify-between h-full rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/50 p-4 backdrop-blur-xl shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
        
        {/* Top Badges */}
        <div>
          <div className="relative h-44 w-full rounded-xl overflow-hidden mb-3.5 bg-slate-900 dark:bg-slate-950">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />

            {/* Badges Overlay */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getCategoryBadgeColor(item.category)}`}>
                {item.category}
              </span>
              
              <div className="flex items-center gap-1">
                {item.isPinned && (
                  <span className="p-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30" title="Pinned Item">
                    <Pin className="w-3 h-3" />
                  </span>
                )}
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-[10px] text-slate-300 font-mono">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Verified</span>
                </span>
              </div>
            </div>

            {/* Version Overlay */}
            <div className="absolute bottom-2.5 left-2.5">
              <span className="px-2 py-0.5 rounded bg-slate-900/90 text-slate-200 text-[10px] font-mono border border-slate-700">
                {item.version}
              </span>
            </div>
          </div>

          {/* Title and Tagline */}
          <div className="space-y-1.5 mb-3">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors text-base line-clamp-1">
              {item.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {item.tagline}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {item.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-950 text-[10px] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800/80"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions & Stats */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
          
          <div className="flex flex-col text-xs">
            <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{item.rating}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-500">({item.ratingsCount})</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              {item.downloadsCount.toLocaleString()} dl
            </span>
          </div>

          <button
            onClick={onQuickDownload}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all duration-200 ${
              isDownloaded
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500 hover:text-slate-950'
            }`}
          >
            {isDownloaded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Downloaded</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Get</span>
              </>
            )}
          </button>

        </div>

      </div>
    </Card3D>
  );
};
