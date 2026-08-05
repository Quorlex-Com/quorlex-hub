import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, SlidersHorizontal, Search, Sparkles, Inbox } from 'lucide-react';
import { ItemCard } from './ItemCard';
import { HubItem, CategoryType } from '../types';

interface ItemGridProps {
  items: HubItem[];
  activeCategory: CategoryType;
  searchQuery: string;
  onSelectItem: (item: HubItem) => void;
  onQuickDownload: (item: HubItem, e: React.MouseEvent) => void;
  downloadedItemIds: Set<string>;
}

export const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  activeCategory,
  searchQuery,
  onSelectItem,
  onQuickDownload,
  downloadedItemIds,
}) => {
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'name'>('popular');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    items.forEach((item) => item.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet).slice(0, 12);
  }, [items]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Category Filter
        if (activeCategory !== 'all' && item.category !== activeCategory) {
          return false;
        }

        // Tag Filter
        if (selectedTag && !item.tags?.includes(selectedTag)) {
          return false;
        }

        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchTagline = item.tagline.toLowerCase().includes(q);
          const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q));
          const matchTarget = item.targetVersion.toLowerCase().includes(q);
          return matchTitle || matchTagline || matchTags || matchTarget;
        }

        return true;
      })
      .sort((a, b) => {
        // Pinned items stay on top
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        if (sortBy === 'popular') return b.downloadsCount - a.downloadsCount;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [items, activeCategory, searchQuery, selectedTag, sortBy]);

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Controls Bar: Sort, Tags, Counter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        
        {/* Active Title / Filter Summary */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 capitalize tracking-tight flex items-center gap-2">
            <span>{activeCategory === 'all' ? 'All Digital Releases' : `${activeCategory} Collection`}</span>
            <span className="text-xs font-normal text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-0.5 rounded-full">
              {filteredItems.length} items
            </span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Official assets verified for security, high speed, and stability.
          </p>
        </div>

        {/* Sorting Dropdown & Tag Filter Pills */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span className="text-slate-500 dark:text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-cyan-600 dark:text-cyan-300 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="popular" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">Most Downloaded</option>
              <option value="rating" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">Highest Rated</option>
              <option value="newest" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">Latest Release</option>
              <option value="name" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">Name (A-Z)</option>
            </select>
          </div>

        </div>

      </div>

      {/* Tag Chips Scroll */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-8 pb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap mr-1">Popular Tags:</span>
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors"
            >
              Clear Tag ×
            </button>
          )}
          {allTags.map((tag) => {
            const active = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(active ? null : tag)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap border transition-all ${
                  active
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200 shadow-sm'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Items Grid Layout */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
              >
                <ItemCard
                  item={item}
                  onClick={() => onSelectItem(item)}
                  onQuickDownload={(e) => onQuickDownload(item, e)}
                  isDownloaded={downloadedItemIds.has(item.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty Results State */
        <div className="py-20 text-center rounded-3xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-8 max-w-md mx-auto shadow-sm">
          <Inbox className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No assets found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Try adjusting your search query, clearing tag filters, or selecting another category.
          </p>
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 text-xs font-bold hover:bg-cyan-500/30 transition-all"
            >
              Reset Tag Filter
            </button>
          )}
        </div>
      )}

    </section>
  );
};
