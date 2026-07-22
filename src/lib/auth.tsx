import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, Organization, OrganizationMember, MemberRole } from '../types';
import { mockUsers, mockOrganizations, mockMembers } from '../data';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  organizations: Organization[];
  currentOrg: Organization | null;
  currentRole: MemberRole | null;
  members: OrganizationMember[];
};

type AuthContextType = AuthState & {
  signIn: (email: string) => void;
  signUp: (name: string, email: string) => void;
  signOut: () => void;
  switchOrg: (orgId: string) => void;
  createOrganization: (org: Organization) => void;
  addMember: (member: OrganizationMember) => void;
  removeMember: (memberId: string) => void;
  updateMemberRole: (memberId: string, role: MemberRole) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'awardly_auth';

function loadState(): AuthState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveState(state: AuthState) {
  try {
    const toSave = { ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch { /* noop */ }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const saved = loadState();

  const [user, setUser] = useState<User | null>(saved?.user ?? null);
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(saved?.currentOrg?.id ?? null);

  const userMemberships = user
    ? mockMembers.filter(m => m.userId === user.id)
    : [];

  const userOrgIds = userMemberships.map(m => m.orgId);
  const userOrganizations = mockOrganizations.filter(o => userOrgIds.includes(o.id));
  const currentOrg = userOrganizations.find(o => o.id === currentOrgId) ?? userOrganizations[0] ?? null;
  const currentMembership = userMemberships.find(m => m.orgId === currentOrg?.id) ?? null;

  const state: AuthState = {
    user,
    isAuthenticated: !!user,
    organizations: userOrganizations,
    currentOrg,
    currentRole: currentMembership?.role ?? null,
    members: currentOrg ? mockMembers.filter(m => m.orgId === currentOrg.id) : [],
  };

  const signIn = useCallback((email: string) => {
    let found = mockUsers.find(u => u.email === email);
    if (!found) {
      found = mockUsers[0];
    }
    setUser(found);
    const orgs = mockMembers.filter(m => m.userId === found!.id).map(m => m.orgId);
    if (orgs.length > 0) setCurrentOrgId(orgs[0]);
  }, []);

  const signUp = useCallback((name: string, email: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      role: 'user',
      followingOrgIds: [],
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setCurrentOrgId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const switchOrg = useCallback((orgId: string) => {
    setCurrentOrgId(orgId);
  }, []);

  const createOrganization = useCallback((org: Organization) => {
    mockOrganizations.push(org);
    if (user) {
      const membership: OrganizationMember = {
        id: `mem_${Date.now()}`,
        userId: user.id,
        orgId: org.id,
        role: 'owner',
        joinedAt: new Date().toISOString(),
      };
      mockMembers.push(membership);
    }
    setCurrentOrgId(org.id);
  }, [user]);

  const addMember = useCallback((member: OrganizationMember) => {
    mockMembers.push(member);
  }, []);

  const removeMember = useCallback((memberId: string) => {
    const idx = mockMembers.findIndex(m => m.id === memberId);
    if (idx !== -1) mockMembers.splice(idx, 1);
  }, []);

  const updateMemberRole = useCallback((memberId: string, role: MemberRole) => {
    const member = mockMembers.find(m => m.id === memberId);
    if (member) member.role = role;
  }, []);

  // Persist
  useEffect(() => { saveState(state); }, [user, currentOrgId]);

  return (
    <AuthContext.Provider value={{
      ...state, signIn, signUp, signOut, switchOrg,
      createOrganization, addMember, removeMember, updateMemberRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
