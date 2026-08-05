import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Download, ShieldCheck, Box, Cpu, Users, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { Card3D } from './Card3D';
import { HubItem, CategoryType, GlobalStats } from '../types';

interface HeroSectionProps {
  stats: GlobalStats;
  featuredItems: HubItem[];
  onSelectItem: (item: HubItem) => void;
  onExploreCategory: (category: CategoryType) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  stats,
  featuredItems,
  onSelectItem,
  onExploreCategory,
}) => {
  const topFeatured = featuredItems.length > 0 ? featuredItems[0] : null;

  return (
    <section className="relative overflow-hidden pt-8 pb-16 border-b border-slate-200/80 dark:border-slate-800/60">
      
      {/* Dynamic Ambient Glowing Backdrop & Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-indigo-600/15 to-purple-600/20 blur-[120px] rounded-full opacity-60 dark:opacity-100" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/15 blur-[90px] rounded-full opacity-60 dark:opacity-100" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-500/15 blur-[100px] rounded-full opacity-60 dark:opacity-100" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Status Pill */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-cyan-500/30 shadow-lg shadow-cyan-500/5 backdrop-blur-md"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Official Release Distribution Hub
              </span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-mono px-2 py-0.5 rounded-full border border-cyan-500/30">
                v2026.8
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.1]"
            >
              Minecraft Mods & <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-indigo-300 dark:to-purple-400">
                Digital Assets Hub
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-700 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Discover community-verified <strong className="text-cyan-600 dark:text-cyan-300 font-semibold">Minecraft Mods</strong>, <strong className="text-purple-600 dark:text-purple-300 font-semibold">Server Plugins</strong>, desktop <strong className="text-indigo-600 dark:text-indigo-300 font-semibold">Software</strong>, and <strong className="text-pink-600 dark:text-pink-300 font-semibold">3D Digital Assets</strong> with direct downloads and security scans.
            </motion.p>

            {/* Key Assurance Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-600 dark:text-slate-400 pt-2"
            >
              <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>100% Virus Scanned</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Instant High-Speed CDN</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                <span>Admin Verified Only</span>
              </div>
            </motion.div>

            {/* Call to Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2"
            >
              <button
                onClick={() => onExploreCategory('mods')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all duration-200"
              >
                <Box className="w-4 h-4 text-white fill-white" />
                <span>Browse Minecraft Mods</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onExploreCategory('all')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-all duration-200 shadow-sm"
              >
                <span>View All Assets</span>
              </button>
            </motion.div>

          </div>

          {/* Right Column 4D Feature Interactive Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-5"
          >
            {topFeatured && (
              <Card3D onClick={() => onSelectItem(topFeatured)} className="group">
                <div className="relative rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-cyan-500/30 p-5 shadow-2xl backdrop-blur-xl overflow-hidden hover:border-cyan-400/60 transition-all">
                  
                  {/* Floating Highlight Tag */}
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-700 dark:text-cyan-300 text-[11px] font-bold tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Featured Showcase</span>
                  </div>

                  {/* Banner Preview Image */}
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4 bg-slate-950">
                    <img
                      src={topFeatured.imageUrl}
                      alt={topFeatured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-[11px] font-semibold text-cyan-300 uppercase tracking-wide">
                        {topFeatured.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-[11px] font-bold text-emerald-300">
                        {topFeatured.version}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {topFeatured.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {topFeatured.tagline}
                    </p>

                    {/* Stats summary */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-mono">
                        <Download className="w-3.5 h-3.5" />
                        <span>{topFeatured.downloadsCount.toLocaleString()} downloads</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-bold">
                        ★ <span>{topFeatured.rating}</span>
                        <span className="text-slate-500 text-[10px]">({topFeatured.ratingsCount})</span>
                      </div>
                    </div>
                  </div>

                </div>
              </Card3D>
            )}
          </motion.div>

        </div>

        {/* Global Statistics Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl"
        >
          <div className="text-center p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-400 font-mono">
              {stats.totalDownloads.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Total Downloads
            </div>
          </div>

          <div className="text-center p-3 border-l border-slate-200 dark:border-slate-800/80">
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 font-mono">
              {stats.totalAssets}
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Published Assets
            </div>
          </div>

          <div className="text-center p-3 border-l border-slate-200 dark:border-slate-800/80">
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-400 font-mono">
              {stats.bandwidthServed}
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Bandwidth Served
            </div>
          </div>

          <div className="text-center p-3 border-l border-slate-200 dark:border-slate-800/80">
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-600 dark:from-indigo-400 dark:to-pink-400 font-mono">
              {stats.discordMembers.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Discord Community
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
