import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/convex-auth';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export function PostAuthRedirect() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const convexUser = useQuery(
    api.users.queries.getUserByFirebaseUid,
    user ? { firebaseUid: user.id } : 'skip'
  );

  const memberships = useQuery(
    api.organizationMembers.queries.getMyMemberships,
    convexUser ? { userId: convexUser._id } : 'skip'
  );

  const judgeAssignments = useQuery(
    api.judges.queries.getMyAssignments,
    convexUser ? { userId: convexUser._id } : 'skip'
  );

  useEffect(() => {
    if (!user) {
      navigate('/auth/login', { replace: true });
      return;
    }

    if (memberships === undefined || judgeAssignments === undefined) return;

    const hasOrgRole = memberships?.some(m => m.role !== 'judge') ?? false;
    const hasJudgeRole = (judgeAssignments?.length ?? 0) > 0;

    if (hasOrgRole) {
      navigate('/dashboard', { replace: true });
    } else if (hasJudgeRole) {
      navigate('/judge', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  }, [user, memberships, judgeAssignments, navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-dark-950">
      <div className="text-center">
        <div className="h-8 w-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-dark-400 text-sm">Setting up your portal...</p>
      </div>
    </div>
  );
}
