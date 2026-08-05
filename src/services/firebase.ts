import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  increment,
  getDocFromServer
} from 'firebase/firestore';
import { HubItem, Comment, DownloadRecord } from '../types';
import { INITIAL_ITEMS, INITIAL_COMMENTS } from '../data/initialData';
import { SupabaseService } from './supabase';

import firebaseConfig from '../../firebase-applet-config.json';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let isFirebaseConfigured = false;

if (firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY' && firebaseConfig.apiKey !== 'DEMO_KEY') {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(app);
    isFirebaseConfigured = true;
    console.log('🔥 Firebase initialized successfully on Quorlex Hub');
  } catch (e) {
    console.log('Running in Local Hybrid Mode with high-speed state persistence.');
  }
} else {
  console.log('Running in Local Hybrid Mode with high-speed state persistence.');
}

export { db, auth, isFirebaseConfigured };

// Firestore Error Handler helper per skill rules
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  return errInfo;
}

// Data Store Abstraction: Local + Firebase Sync
const LOCAL_STORAGE_ITEMS_KEY = 'quorlex_hub_items_v2';
const LOCAL_STORAGE_COMMENTS_KEY = 'quorlex_hub_comments_v2';
const LOCAL_STORAGE_DOWNLOADS_KEY = 'quorlex_hub_downloads_v2';

export const HubStorageService = {
  // Fetch Items
  getItems: async (): Promise<HubItem[]> => {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'items'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const items: HubItem[] = [];
          querySnapshot.forEach((docSnap) => {
            items.push({ id: docSnap.id, ...docSnap.data() } as HubItem);
          });
          return items;
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'items');
      }
    }

    // Local Storage Fallback / First Load
    const local = localStorage.getItem(LOCAL_STORAGE_ITEMS_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        // Fallback
      }
    }
    // Initialize default items
    localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(INITIAL_ITEMS));
    return INITIAL_ITEMS;
  },

  // Save/Create Item (Admin Only)
  saveItem: async (item: HubItem): Promise<HubItem> => {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'items', item.id), item);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `items/${item.id}`);
      }
    }

    // Always keep local storage updated
    const items = await HubStorageService.getItems();
    const index = items.findIndex((i) => i.id === item.id);
    let updated: HubItem[];
    if (index >= 0) {
      updated = [...items];
      updated[index] = item;
    } else {
      updated = [item, ...items];
    }
    localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(updated));
    return item;
  },

  // Delete Item (Admin Only)
  deleteItem: async (itemId: string): Promise<void> => {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'items', itemId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `items/${itemId}`);
      }
    }

    const items = await HubStorageService.getItems();
    const filtered = items.filter((i) => i.id !== itemId);
    localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(filtered));
  },

  // Increment Download Count
  incrementDownload: async (itemId: string): Promise<number> => {
    let newCount = 0;
    if (isFirebaseConfigured && db) {
      try {
        const itemRef = doc(db, 'items', itemId);
        await updateDoc(itemRef, {
          downloadsCount: increment(1)
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `items/${itemId}`);
      }
    }

    // Update Local
    const items = await HubStorageService.getItems();
    const updated = items.map((i) => {
      if (i.id === itemId) {
        newCount = i.downloadsCount + 1;
        return { ...i, downloadsCount: newCount };
      }
      return i;
    });
    localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(updated));
    return newCount;
  },

  // Get Comments
  getComments: async (itemId: string): Promise<Comment[]> => {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(
          collection(db, 'items', itemId, 'comments'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const comments: Comment[] = [];
          snapshot.forEach((docSnap) => {
            comments.push({ id: docSnap.id, ...docSnap.data() } as Comment);
          });
          return comments;
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `items/${itemId}/comments`);
      }
    }

    // Local Storage
    const local = localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY);
    const allComments: Comment[] = local ? JSON.parse(local) : INITIAL_COMMENTS;
    return allComments.filter((c) => c.itemId === itemId);
  },

  // Add Comment
  addComment: async (comment: Comment): Promise<Comment> => {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'items', comment.itemId, 'comments', comment.id), comment);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `items/${comment.itemId}/comments/${comment.id}`);
      }
    }

    // Sync to Supabase if configured
    SupabaseService.syncCommentsToSupabase([comment]);

    // Update Local
    const local = localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY);
    const allComments: Comment[] = local ? JSON.parse(local) : INITIAL_COMMENTS;
    const updated = [comment, ...allComments];
    localStorage.setItem(LOCAL_STORAGE_COMMENTS_KEY, JSON.stringify(updated));
    return comment;
  },

  // Download History for user
  getDownloadHistory: (): DownloadRecord[] => {
    const local = localStorage.getItem(LOCAL_STORAGE_DOWNLOADS_KEY);
    return local ? JSON.parse(local) : [];
  },

  addDownloadRecord: (record: DownloadRecord): DownloadRecord[] => {
    const current = HubStorageService.getDownloadHistory();
    const updated = [record, ...current.filter((r) => r.itemId !== record.itemId)].slice(0, 50);
    localStorage.setItem(LOCAL_STORAGE_DOWNLOADS_KEY, JSON.stringify(updated));

    // Sync to Supabase if configured
    SupabaseService.syncDownloadsToSupabase([record]);

    return updated;
  }
};

// Google OAuth Login Trigger
export async function loginWithGoogleOAuth() {
  if (isFirebaseConfigured && auth) {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error("Google Auth popup failed:", error);
      throw error;
    }
  }
  return null;
}

export async function loginWithEmail(email: string, pass: string) {
  if (isFirebaseConfigured && auth) {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  }
  return null;
}

export async function signupWithEmail(email: string, pass: string) {
  if (isFirebaseConfigured && auth) {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    return result.user;
  }
  return null;
}

export async function logoutUser() {
  if (isFirebaseConfigured && auth) {
    await firebaseSignOut(auth);
  }
}
