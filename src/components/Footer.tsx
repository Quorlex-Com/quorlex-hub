import React from 'react';
import { ShieldCheck, Heart, Sparkles, Box, Cpu, ExternalLink } from 'lucide-react';
import { CategoryType } from '../types';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/images/quorlex_logo_1785932146789.jpg';

interface FooterProps {
  onSelectCategory: (cat: CategoryType) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenAdmin }) => {
  const { isAdmin } = useAuth();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-12 pb-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/80 overflow-hidden shadow-md shadow-cyan-500/10">
                <img 
                  src={logoImg} 
                  alt="Quorlex Logo" 
                  className="w-full h-full object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-extrabold text-base text-slate-100 tracking-tight">
                QUORLEX <span className="text-cyan-400">HUB</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Official digital asset distribution hub for Minecraft Mods, Plugins, Game Software, and 3D Assets.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Distribution Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onSelectCategory('mods')} className="hover:text-cyan-400 transition-colors">
                  Minecraft Mods (Fabric & Forge)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('plugins')} className="hover:text-cyan-400 transition-colors">
                  Server Plugins (Spigot & Paper)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('software')} className="hover:text-cyan-400 transition-colors">
                  Desktop Software & Tools
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('assets')} className="hover:text-cyan-400 transition-colors">
                  3D Assets & PBR Textures
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Verification */}
          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
              Security & Verification
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>VirusTotal SHA-256 Scanned</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zero Malware Policy</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-purple-400" />
                <span>Direct CDN Mirroring</span>
              </li>
            </ul>
          </div>

          {/* Community or Admin Column */}
          {isAdmin ? (
            <div>
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
                Owner Control
              </h4>
              <p className="text-slate-400 mb-3 leading-relaxed">
                Administrative management and distribution logic powered by Quorlex Master Console.
              </p>
              <button
                onClick={onOpenAdmin}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all"
              >
                Owner Admin Console
              </button>
            </div>
          ) : (
            <div>
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
                Community & Support
              </h4>
              <p className="text-slate-400 mb-3 leading-relaxed">
                Join our community server to connect with creators, request mods, and receive fast support.
              </p>
              <a
                href={localStorage.getItem('quorlex_discord_invite') || 'https://discord.gg/quorlex'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white hover:border-cyan-500/40 font-semibold transition-all"
              >
                <span>Discord Community</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 Quorlex Hub. Built for creators and developers worldwide.</p>
          <p className="flex items-center gap-1 font-mono text-[11px]">
            <span>Verified distribution for mods, plugins & software</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
