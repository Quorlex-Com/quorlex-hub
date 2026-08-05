import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AppNotification, DownloadRecord } from '../types';
import { INITIAL_NOTIFICATIONS } from '../data/initialData';
import { HubStorageService, loginWithGoogleOAuth, loginWithEmail, signupWithEmail, logoutUser, isFirebaseConfigured, auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  loginAsAdminPasskey: (key: string) => boolean;
  toggleAdminMode: () => void;
  loginGoogle: () => Promise<void>;
  loginEmail: (email: string, pass: string) => Promise<void>;
  signupEmail: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  authErrorNotice: string | null;
  clearAuthErrorNotice: () => void;
  notifications: AppNotification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  pushEnabled: boolean;
  requestPushPermission: () => Promise<boolean>;
  downloadHistory: DownloadRecord[];
  recordDownload: (record: DownloadRecord) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PASSKEY = 'QUORLEX-ADMIN-2026';
const OWNER_EMAIL = 'ainagisakun@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('quorlex_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    // Default to guest (logged out) for public visitors
    return null;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('quorlex_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [pushEnabled, setPushEnabled] = useState<boolean>(() => {
    return localStorage.getItem('quorlex_push_enabled') === 'true';
  });

  const [downloadHistory, setDownloadHistory] = useState<DownloadRecord[]>(() => {
    return HubStorageService.getDownloadHistory();
  });

  // Auth listener if Firebase configured
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const isOwner = fbUser.email === OWNER_EMAIL;
          const profile: UserProfile = {
            uid: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Member',
            email: fbUser.email || '',
            avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.uid}`,
            role: isOwner ? 'admin' : 'user',
            discordConnected: false
          };
          setUser(profile);
          localStorage.setItem('quorlex_user', JSON.stringify(profile));
        }
      });
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('quorlex_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('quorlex_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('quorlex_notifs', JSON.stringify(notifications));
  }, [notifications]);

  const isAdmin = user?.role === 'admin' || user?.email === OWNER_EMAIL;

  const loginAsAdminPasskey = (key: string): boolean => {
    if (key.trim().toUpperCase() === ADMIN_PASSKEY || key.trim() === 'admin') {
      const adminProfile: UserProfile = {
        uid: 'admin-owner-001',
        name: 'Ainagi (Quorlex Owner)',
        email: OWNER_EMAIL,
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=QuorlexOwner',
        role: 'admin',
        discordConnected: true,
        discordTag: 'QuorlexOwner#0001'
      };
      setUser(adminProfile);
      return true;
    }
    return false;
  };

  const toggleAdminMode = () => {
    if (isAdmin) {
      setUser({
        uid: 'guest-user-99',
        name: 'Guest Explorer',
        email: 'visitor@quorlex.hub',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GuestExplorer',
        role: 'user'
      });
    } else {
      loginAsAdminPasskey('admin');
    }
  };

  const [authErrorNotice, setAuthErrorNotice] = useState<string | null>(null);

  const loginGoogle = async () => {
    setAuthErrorNotice(null);
    try {
      if (isFirebaseConfigured) {
        await loginWithGoogleOAuth();
      } else {
        // Simulated OAuth Login
        const mockOAuthUser: UserProfile = {
          uid: `user-${Date.now()}`,
          name: 'Community Member',
          email: 'community@quorlex.hub',
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`,
          role: 'user',
          discordConnected: true,
          discordTag: 'Member#8842'
        };
        setUser(mockOAuthUser);
      }
    } catch (e: any) {
      console.error('Google Sign-In Error:', e);
      const errCode = e?.code || e?.message || '';
      if (errCode.includes('auth/unauthorized-domain') || String(e).includes('unauthorized-domain')) {
        const domain = window.location.hostname;
        setAuthErrorNotice(
          `Domain Authorization Required: Please add "${domain}" to your Firebase Console under Authentication > Settings > Authorized domains. We have logged you in with a local guest profile so you can continue using the hub.`
        );
        // Fallback local profile so user experience is smooth
        setUser({
          uid: `local-user-${Date.now()}`,
          name: 'Community Member',
          email: 'member@quorlex.hub',
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`,
          role: 'user'
        });
      } else {
        setAuthErrorNotice(`Sign-in notice: ${e?.message || 'Failed to complete Google Sign-In'}`);
      }
    }
  };

  const loginEmail = async (email: string, pass: string) => {
    setAuthErrorNotice(null);
    try {
      if (isFirebaseConfigured) {
        const fbUser = await loginWithEmail(email, pass);
        if (fbUser) {
          const isOwner = fbUser.email === OWNER_EMAIL;
          const profile: UserProfile = {
            uid: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Member',
            email: fbUser.email || '',
            avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.uid}`,
            role: isOwner ? 'admin' : 'user'
          };
          setUser(profile);
        }
      } else {
        const isOwner = email.toLowerCase() === OWNER_EMAIL.toLowerCase();
        const profile: UserProfile = {
          uid: `local-${Date.now()}`,
          name: email.split('@')[0],
          email: email,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
          role: isOwner ? 'admin' : 'user'
        };
        setUser(profile);
      }
    } catch (e: any) {
      console.error('Email login error:', e);
      throw new Error(e?.message || 'Failed to sign in with email/password');
    }
  };

  const signupEmail = async (email: string, pass: string) => {
    setAuthErrorNotice(null);
    try {
      if (isFirebaseConfigured) {
        const fbUser = await signupWithEmail(email, pass);
        if (fbUser) {
          const isOwner = fbUser.email === OWNER_EMAIL;
          const profile: UserProfile = {
            uid: fbUser.uid,
            name: fbUser.email?.split('@')[0] || 'Member',
            email: fbUser.email || '',
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.uid}`,
            role: isOwner ? 'admin' : 'user'
          };
          setUser(profile);
        }
      } else {
        const isOwner = email.toLowerCase() === OWNER_EMAIL.toLowerCase();
        const profile: UserProfile = {
          uid: `local-${Date.now()}`,
          name: email.split('@')[0],
          email: email,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
          role: isOwner ? 'admin' : 'user'
        };
        setUser(profile);
      }
    } catch (e: any) {
      console.error('Email signup error:', e);
      throw new Error(e?.message || 'Failed to create account');
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    localStorage.removeItem('quorlex_user');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const requestPushPermission = async (): Promise<boolean> => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setPushEnabled(granted);
      localStorage.setItem('quorlex_push_enabled', String(granted));
      if (granted) {
        new Notification('Quorlex Hub Push Alerts Enabled', {
          body: 'You will now receive instant update alerts when new apps, mods or plugins launch!',
          icon: '/assets/icon.png'
        });
      }
      return granted;
    }
    return false;
  };

  const recordDownload = (record: DownloadRecord) => {
    const updated = HubStorageService.addDownloadRecord(record);
    setDownloadHistory(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loginAsAdminPasskey,
        toggleAdminMode,
        loginGoogle,
        loginEmail,
        signupEmail,
        logout,
        authErrorNotice,
        clearAuthErrorNotice: () => setAuthErrorNotice(null),
        notifications,
        unreadCount,
        markNotificationRead,
        pushEnabled,
        requestPushPermission,
        downloadHistory,
        recordDownload,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
