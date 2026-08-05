import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Download, 
  Bell, 
  Sun, 
  Moon, 
  ShieldCheck, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  ChevronDown,
  Layers,
  Box,
  Cpu,
  Smartphone,
  Palette,
  ExternalLink,
  Lock,
  Key
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CategoryType } from '../types';
import { AuthModal } from './AuthModal';
import logoImg from '../assets/images/quorlex_logo_1785932146789.jpg';

interface HeaderProps {
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onOpenSearch: () => void;
  onOpenDownloads: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenSearch,
  onOpenDownloads,
  onOpenAdmin,
}) => {
  const { 
    user, 
    isAdmin, 
    toggleAdminMode, 
    loginGoogle, 
    logout, 
    unreadCount, 
    notifications, 
    markNotificationRead,
    pushEnabled,
    requestPushPermission,
    loginAsAdminPasskey
  } = useAuth();
  
  const { theme, toggleTheme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifPopoverOpen, setNotifPopoverOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [passkeyModalOpen, setPasskeyModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState(false);

  const isLoggedIn = !!user && user.email !== 'visitor@quorlex.hub' && user.uid !== 'guest-user-99';

  const categories: { id: CategoryType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Items', icon: <Layers className="w-4 h-4" /> },
    { id: 'mods', label: 'Minecraft Mods', icon: <Box className="w-4 h-4 text-emerald-400" /> },
    { id: 'plugins', label: 'Plugins', icon: <Cpu className="w-4 h-4 text-cyan-400" /> },
    { id: 'software', label: 'Software', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
    { id: 'apps', label: 'Apps', icon: <Smartphone className="w-4 h-4 text-amber-400" /> },
    { id: 'assets', label: 'Digital Assets', icon: <Palette className="w-4 h-4 text-pink-400" /> },
  ];

  const [bannerNotice, setBannerNotice] = useState<string | null>(() => {
    return localStorage.getItem('quorlex_announcement') || '🔥 New Release: Quantum Crafting Mod v2.4.1 is live with Minecraft 1.21 Support!';
  });

  const handlePasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAsAdminPasskey(passkeyInput);
    if (success) {
      setPasskeyModalOpen(false);
      setPasskeyInput('');
      setPasskeyError(false);
      onOpenAdmin();
    } else {
      setPasskeyError(true);
    }
  };

  return (
    <>
      {bannerNotice && (
        <div className="bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-slate-900/90 border-b border-indigo-500/30 text-slate-100 text-xs py-1.5 px-4 flex items-center justify-between font-medium relative z-50">
          <div className="flex items-center gap-2 max-w-5xl mx-auto truncate">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
            <span className="truncate">{bannerNotice}</span>
          </div>
          <button
            onClick={() => setBannerNotice(null)}
            className="p-1 text-slate-400 hover:text-white shrink-0"
            title="Dismiss Announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-900/90 dark:bg-slate-950/70 border-b border-slate-200/80 dark:border-slate-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onSelectCategory('all')} 
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 group-hover:border-cyan-500/50 transition-all duration-300 overflow-hidden">
                <img 
                  src={logoImg} 
                  alt="Quorlex Logo" 
                  className="w-full h-full object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-100 tracking-tight flex items-center gap-1">
                  QUORLEX <span className="text-cyan-400 font-semibold">HUB</span>
                </span>
                <span className="text-[10px] text-cyan-400/80 uppercase font-mono tracking-widest block -mt-1">
                  Official Distribution
                </span>
              </div>
            </button>
          </div>

          {/* Search Trigger Bar (Desktop) */}
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-cyan-500/40 hover:bg-slate-900 transition-all duration-200 text-sm w-64 lg:w-80 shadow-inner group"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="flex-1 text-left">Search mods, software, plugins...</span>
            <kbd className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Desktop Right Action Controls */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Discord Widget Shortcut */}
            <a
              href="https://discord.gg/quorlex"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/20 text-xs font-medium transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Discord</span>
              <span className="text-[10px] bg-indigo-950/80 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
                4.8k
              </span>
            </a>

            {/* Downloads Dashboard Trigger */}
            <button
              onClick={onOpenDownloads}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
              title="Download Manager"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Notifications Center Popover */}
            <div className="relative">
              <button
                onClick={() => setNotifPopoverOpen(!notifPopoverOpen)}
                className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-purple-400 hover:border-purple-500/40 transition-all"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              <AnimatePresence>
                {notifPopoverOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-4 z-50"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="font-semibold text-sm text-slate-200">Release Updates</span>
                      {!pushEnabled && (
                        <button
                          onClick={requestPushPermission}
                          className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-md hover:bg-cyan-500/20"
                        >
                          Enable Web Push
                        </button>
                      )}
                    </div>
                    <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto pr-1">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                            n.read 
                              ? 'bg-slate-950/40 border-slate-800/40 text-slate-400' 
                              : 'bg-cyan-500/5 border-cyan-500/20 text-slate-200 font-medium'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-cyan-300">{n.title}</span>
                            <span className="text-[10px] text-slate-500">{n.date}</span>
                          </div>
                          <p className="text-slate-400 leading-relaxed">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Owner/Admin Action Button */}
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs shadow-md shadow-purple-600/20 hover:opacity-90 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Admin Panel</span>
              </button>
            )}

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <img
                  src={user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Guest'}
                  alt="User"
                  className="w-7 h-7 rounded-lg bg-slate-800"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-3 z-50"
                  >
                    <div className="p-2 border-b border-slate-800 mb-2">
                      <p className="font-semibold text-sm text-slate-200">{isLoggedIn ? user?.name : 'Guest Visitor'}</p>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{isLoggedIn ? user?.email : 'visitor@quorlex.hub'}</p>
                      {isAdmin && (
                        <span className="mt-1 inline-block text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-mono">
                          Owner & Admin
                        </span>
                      )}
                    </div>

                    {!isLoggedIn ? (
                      <>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setAuthModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition-all mb-1.5 shadow-md shadow-cyan-500/20"
                        >
                          <User className="w-4 h-4" />
                          <span>Sign In / Register</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            loginGoogle();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition-colors"
                        >
                          <User className="w-4 h-4 text-cyan-400" />
                          <span>Google Sign-In</span>
                        </button>
                      </>
                    ) : (
                      <>
                        {isAdmin ? (
                          <>
                            <button
                              onClick={() => {
                                setUserDropdownOpen(false);
                                onOpenAdmin();
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-purple-300 hover:bg-purple-500/10 transition-colors mb-1 font-semibold"
                            >
                              <ShieldCheck className="w-4 h-4 text-purple-400" />
                              <span>Owner Admin Panel</span>
                            </button>

                            <button
                              onClick={() => {
                                setUserDropdownOpen(false);
                                toggleAdminMode();
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800 transition-colors mb-1"
                            >
                              <Lock className="w-4 h-4 text-slate-400" />
                              <span>Switch to Guest View</span>
                            </button>
                          </>
                        ) : null}

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Mobile Right Controls (Search, Notifications, Profile Avatar & Menu Toggle) */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400"
              title="Search"
            >
              <Search className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={() => setNotifPopoverOpen(!notifPopoverOpen)}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-slate-950">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
              title="User Profile & Menu"
            >
              <img
                src={user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Guest'}
                alt="User Avatar"
                className="w-6 h-6 rounded-lg bg-slate-800"
              />
              {mobileMenuOpen ? <X className="w-4 h-4 text-slate-300" /> : <Menu className="w-4 h-4 text-slate-300" />}
            </button>
          </div>

        </div>
      </div>

      {/* Category Filter Tabs Bar */}
      <div className="border-t border-slate-800/40 bg-slate-950/40 backdrop-blur-md overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 py-2">
          {categories.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  active
                    ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 shadow-2xl"
          >
            {/* User Profile Card */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Guest'}
                  alt="User"
                  className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700"
                />
                <div>
                  <p className="font-bold text-sm text-slate-100">{user?.name || 'Guest User'}</p>
                  <p className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">{user?.email || 'visitor@quorlex.hub'}</p>
                  {isAdmin && (
                    <span className="mt-0.5 inline-block text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded font-mono">
                      Owner & Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenDownloads(); }}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium hover:border-cyan-500/40"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Downloads</span>
              </button>
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium hover:border-amber-500/40"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
                <span>Theme</span>
              </button>
            </div>

            {/* Account & Auth Controls */}
            <div className="space-y-2 pt-1 border-t border-slate-800/80">
              {isAdmin && (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs shadow-lg"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Open Owner Admin Panel</span>
                </button>
              )}

              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In / Register Account</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      loginGoogle();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>Quick Sign In with Google</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-400 hover:bg-rose-500/20"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out ({user?.email})</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Passkey Admin Unlock Modal */}
      <AnimatePresence>
        {passkeyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setPasskeyModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Owner Access Verification</h3>
                  <p className="text-xs text-slate-400">Enter your administrative master passkey</p>
                </div>
              </div>

              <form onSubmit={handlePasskeySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Passkey or Key</label>
                  <input
                    type="password"
                    placeholder="Enter passkey (e.g. QUORLEX-ADMIN-2026 or 'admin')"
                    value={passkeyInput}
                    onChange={(e) => setPasskeyInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm font-mono"
                  />
                  {passkeyError && (
                    <p className="text-xs text-rose-400 mt-1 font-medium">Invalid administrative passkey.</p>
                  )}
                  <p className="text-[11px] text-slate-500 mt-2">
                    Tip: You can also use <span className="font-mono text-cyan-400">admin</span> for quick demo owner authorization.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setPasskeyModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:opacity-90"
                  >
                    Unlock Admin Panel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Auth Modal for Email/Password and Google Sign-In */}
      <AnimatePresence>
        {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
      </AnimatePresence>

    </header>
    </>
  );
};
