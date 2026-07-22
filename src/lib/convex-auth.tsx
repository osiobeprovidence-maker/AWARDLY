import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ConvexProvider, ConvexReactClient, useConvexAuth } from 'convex/react';
import { auth, onAuthChange, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut as firebaseSignOut } from './firebase';
import { useMutation, useQuery } from 'convex/react';
import type { User } from '../types';

// ─── Convex Client ──────────────────────────────────────────────────────────

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL || 'https://placeholder.convex.cloud';

export const convex = new ConvexReactClient(CONVEX_URL);

// ─── Auth Context ───────────────────────────────────────────────────────────

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

// ─── Inner Provider (must be inside ConvexProvider) ─────────────────────────

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Convex mutations/queries
  const syncUser = useMutation('users:syncUser');

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Sync user with Convex backend
          const userId = await syncUser({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            avatarUrl: firebaseUser.photoURL || undefined,
          });

          // For now, store minimal user info
          // In production, we'd query the full user from Convex
          setUser({
            id: userId,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email || '',
            avatarUrl: firebaseUser.photoURL || undefined,
            role: 'user',
            followingOrgIds: [],
            createdAt: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Failed to sync user:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, [syncUser]);

  const handleSignInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const handleSignInWithEmail = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      console.error('Email sign-in failed:', error);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const handleSignUpWithEmail = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      await signUpWithEmail(email, password);
      // The onAuthChange listener will sync the user
    } catch (error) {
      console.error('Email sign-up failed:', error);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    await firebaseSignOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      signInWithGoogle: handleSignInWithGoogle,
      signInWithEmail: handleSignInWithEmail,
      signUpWithEmail: handleSignUpWithEmail,
      signOut: handleSignOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Main Provider (wraps ConvexProvider) ───────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <AuthProviderInner>
        {children}
      </AuthProviderInner>
    </ConvexProvider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Re-export Convex hooks for convenience
export { useQuery, useMutation } from 'convex/react';
