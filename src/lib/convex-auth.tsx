import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ConvexProvider, ConvexReactClient, useQuery, useMutation } from 'convex/react';
import { auth, onAuthChange, signInWithGoogle as fbGoogle, signInWithEmail as fbEmail, signUpWithEmail as fbSignUp, signOut as fbSignOut } from './firebase';
import { api } from '../../convex/_generated/api';
import type { User, Organization, OrganizationMember, MemberRole } from '../types';

// ─── Convex Client ──────────────────────────────────────────────────────────

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL || 'https://placeholder.convex.cloud';
export const convex = new ConvexReactClient(CONVEX_URL);

// ─── Auth Context ───────────────────────────────────────────────────────────

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  organizations: Organization[];
  currentOrg: Organization | null;
  currentRole: MemberRole | null;
  members: OrganizationMember[];
};

type AuthContextType = AuthState & {
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  switchOrg: (orgId: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const ORG_STORAGE_KEY = 'awardly_current_org';

// ─── Inner Provider (must be inside ConvexProvider) ─────────────────────────

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(() => {
    try { return localStorage.getItem(ORG_STORAGE_KEY); } catch { return null; }
  });

  const syncUser = useMutation(api.users.mutations.syncUser);

  // Convex queries — only run when user exists
  const convexUser = useQuery(
    api.users.queries.getUserByFirebaseUid,
    user ? { firebaseUid: user.id } : 'skip'
  );

  const memberships = useQuery(
    api.organizationMembers.queries.getMyMemberships,
    convexUser ? { userId: convexUser._id } : 'skip'
  );

  const orgIds = useMemo(() =>
    memberships?.map(m => m.orgId) ?? [],
    [memberships]
  );

  const organizations = useQuery(
    api.organizations.queries.getByIds,
    orgIds.length > 0 ? { ids: orgIds } : 'skip'
  );

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Pass Firebase ID token to Convex for server-side auth
          try {
            convex.setAuth(async () => {
              const u = auth.currentUser;
              if (!u) return null;
              return await u.getIdToken();
            });
          } catch (e) {
            console.warn('convex.setAuth failed:', e);
          }

          const userId = await syncUser({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            avatarUrl: firebaseUser.photoURL || undefined,
          });

          setUser({
            id: firebaseUser.uid,
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
        setCurrentOrgId(null);
        localStorage.removeItem(ORG_STORAGE_KEY);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, [syncUser]);

  // Derive current org from real data
  const currentOrg = useMemo(() => {
    if (!organizations || organizations.length === 0) return null;
    const found = organizations.find(o => o._id === currentOrgId);
    return found ?? organizations[0] ?? null;
  }, [organizations, currentOrgId]);

  // Derive current role from memberships
  const currentRole = useMemo(() => {
    if (!memberships || !currentOrg) return null;
    const membership = memberships.find(m => m.orgId === currentOrg._id);
    return (membership?.role as MemberRole) ?? null;
  }, [memberships, currentOrg]);

  // Derive members list
  const members = useMemo(() => {
    if (!memberships || !currentOrg) return [];
    return memberships
      .filter(m => m.orgId === currentOrg._id)
      .map(m => ({
        id: m._id,
        userId: m.userId,
        orgId: m.orgId,
        role: m.role as MemberRole,
        invitedBy: m.invitedBy,
        joinedAt: m.joinedAt,
      }));
  }, [memberships, currentOrg]);

  // Map Convex org format to frontend Organization type
  const mappedOrganizations: Organization[] = useMemo(() => {
    if (!organizations) return [];
    return organizations.map(org => ({
      id: org._id,
      name: org.name,
      slug: org.slug,
      description: org.description,
      type: org.type as any,
      logoUrl: org.logoUrl,
      coverUrl: org.coverUrl,
      primaryColor: org.primaryColor,
      secondaryColor: org.secondaryColor,
      website: org.website,
      country: org.country,
      headquarters: org.headquarters,
      foundedYear: org.foundedYear,
      contactEmail: org.contactEmail,
      phone: org.phone,
      socialLinks: org.socialLinks,
      isVerified: org.isVerified,
      verificationStatus: org.verificationStatus,
      followerCount: org.followerCount,
      memberCount: org.memberCount,
      eventCount: org.eventCount,
      createdAt: org.createdAt,
    }));
  }, [organizations]);

  const mappedCurrentOrg = useMemo(() => {
    if (!currentOrg) return null;
    return mappedOrganizations.find(o => o.id === currentOrg._id) ?? null;
  }, [currentOrg, mappedOrganizations]);

  // Persist current org
  useEffect(() => {
    if (currentOrgId) {
      localStorage.setItem(ORG_STORAGE_KEY, currentOrgId);
    } else {
      localStorage.removeItem(ORG_STORAGE_KEY);
    }
  }, [currentOrgId]);

  // Auth handlers
  const handleSignInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      await fbGoogle();
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const handleSignInWithEmail = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await fbEmail(email, password);
    } catch (error) {
      console.error('Email sign-in failed:', error);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const handleSignUpWithEmail = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      await fbSignUp(email, password);
    } catch (error) {
      console.error('Email sign-up failed:', error);
      setIsLoading(false);
      throw error;
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    await fbSignOut();
    try { convex.clearAuth(); } catch {}
    setUser(null);
    setCurrentOrgId(null);
    localStorage.removeItem(ORG_STORAGE_KEY);
  }, []);

  const handleSwitchOrg = useCallback((orgId: string) => {
    setCurrentOrgId(orgId);
  }, []);

  const state: AuthState = {
    user,
    isAuthenticated: !!user,
    isLoading,
    organizations: mappedOrganizations,
    currentOrg: mappedCurrentOrg,
    currentRole,
    members,
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      signInWithGoogle: handleSignInWithGoogle,
      signInWithEmail: handleSignInWithEmail,
      signUpWithEmail: handleSignUpWithEmail,
      signOut: handleSignOut,
      switchOrg: handleSwitchOrg,
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
