import { useState, useEffect, useCallback } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────
export interface FeedUser {
  id: string;
  name: string;
  avatar: string;
  handle: string;
}

export interface Comment {
  id: string;
  user: FeedUser;
  text: string;
  timestamp: number;
  likes: number;
  likedByMe: boolean;
  replies: Comment[];
}

export interface FeedPost {
  id: string;
  user: FeedUser;
  text: string;
  timestamp: number;
  likes: number;
  likedByMe: boolean;
  bookmarked: boolean;
  comments: Comment[];
  images?: string[];
  video?: string;
  poll?: { question: string; options: Array<{ label: string; votes: number }> };
  shares: number;
}

export interface ChatMessage {
  id: string;
  user: FeedUser;
  text: string;
  timestamp: number;
}

export interface StreamData {
  title: string;
  description: string;
  youtubeVideoId: string;
  status: 'live' | 'replay' | 'upcoming';
  startedAt?: number;
  scheduledAt?: number;
  viewerCount: number;
  likeCount: number;
  commentCount: number;
  trending: number;
  countries: number;
}

// ─── Mock Users ────────────────────────────────────────────────────────────
export const mockUsers: FeedUser[] = [
  { id: 'u1', name: 'Adaobi Nwosu', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', handle: '@adaobi' },
  { id: 'u2', name: 'Tunde Bakare', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', handle: '@tunde' },
  { id: 'u3', name: 'Ngozi Okafor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', handle: '@ngozi' },
  { id: 'u4', name: 'Emeka Obi', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', handle: '@emeka' },
  { id: 'u5', name: 'Fatima Abubakar', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=100', handle: '@fatima' },
  { id: 'u6', name: 'Kemi Adeyemi', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100', handle: '@kemi' },
  { id: 'u7', name: 'Chidi Eze', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=100', handle: '@chidi' },
  { id: 'u8', name: 'Zainab Mohammed', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=100', handle: '@zainab' },
];

export const currentUser: FeedUser = { id: 'me', name: 'You', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100', handle: '@you' };

// ─── Mock Stream ───────────────────────────────────────────────────────────
export const mockStream: StreamData = {
  title: 'The 17th Headies 2026 — Live from Lagos',
  description: 'Celebrating the best in African music. Watch the full ceremony live with performances, award presentations, and exclusive backstage moments.',
  youtubeVideoId: 'dQw4w9WgXcQ',
  status: 'live',
  startedAt: Date.now() - (18 * 60 * 1000),
  viewerCount: 12483,
  likeCount: 8214,
  commentCount: 1326,
  trending: 1,
  countries: 42,
};

// ─── Mock Posts ────────────────────────────────────────────────────────────
export const mockPosts: FeedPost[] = [
  {
    id: 'p1',
    user: mockUsers[0],
    text: 'Burna Boy just delivered the performance of the year! That transition from "Last Last" into the new track gave me chills. This is why he\'s the African Giant. 🌍🎶 #Headies2026 #Afrobeats',
    timestamp: Date.now() - (5 * 60 * 1000),
    likes: 234,
    likedByMe: false,
    bookmarked: false,
    comments: [
      { id: 'c1', user: mockUsers[1], text: 'Facts! That performance was legendary 🔥', timestamp: Date.now() - (4 * 60 * 1000), likes: 12, likedByMe: false, replies: [] },
      { id: 'c2', user: mockUsers[2], text: 'I literally got goosebumps!', timestamp: Date.now() - (3 * 60 * 1000), likes: 8, likedByMe: false, replies: [] },
    ],
    shares: 45,
  },
  {
    id: 'p2',
    user: mockUsers[3],
    text: 'The production quality this year is insane. The stage design, the lighting, the camera work — everything is top tier. Headies has really set the bar high.',
    timestamp: Date.now() - (12 * 60 * 1000),
    likes: 156,
    likedByMe: false,
    bookmarked: true,
    comments: [
      { id: 'c3', user: mockUsers[4], text: 'The stage literally took my breath away 😍', timestamp: Date.now() - (10 * 60 * 1000), likes: 5, likedByMe: false, replies: [] },
    ],
    shares: 23,
  },
  {
    id: 'p3',
    user: mockUsers[5],
    text: 'Who else is voting for Ayra Starr for Next Rated? She absolutely deserves it this year!',
    timestamp: Date.now() - (20 * 60 * 1000),
    likes: 89,
    likedByMe: false,
    bookmarked: false,
    comments: [],
    poll: {
      question: 'Who should win Next Rated?',
      options: [
        { label: 'Ayra Starr', votes: 4521 },
        { label: 'Rema', votes: 3890 },
        { label: 'Asake', votes: 2100 },
        { label: 'Fireboy DML', votes: 1560 },
      ],
    },
    shares: 67,
  },
  {
    id: 'p4',
    user: mockUsers[6],
    text: 'Backstage exclusive! Just saw the team preparing for the closing ceremony. The energy backstage is unreal. Everyone is buzzing!',
    timestamp: Date.now() - (35 * 60 * 1000),
    likes: 312,
    likedByMe: false,
    bookmarked: false,
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600',
    ],
    comments: [
      { id: 'c4', user: mockUsers[7], text: 'The VIP area looks incredible!', timestamp: Date.now() - (30 * 60 * 1000), likes: 3, likedByMe: false, replies: [] },
    ],
    shares: 89,
  },
  {
    id: 'p5',
    user: mockUsers[7],
    text: 'The audience reaction when Don Jazzy walked out was priceless 😂 Pure joy on everyone\'s face.',
    timestamp: Date.now() - (45 * 60 * 1000),
    likes: 445,
    likedByMe: false,
    bookmarked: false,
    comments: [],
    video: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=600',
    shares: 134,
  },
];

// ─── Mock Chat Messages ────────────────────────────────────────────────────
const chatMessages: ChatMessage[] = [
  { id: 'm1', user: mockUsers[0], text: 'This is incredible! 🔥', timestamp: Date.now() - (120000) },
  { id: 'm2', user: mockUsers[1], text: 'BURNAAAA! My goat!!', timestamp: Date.now() - (90000) },
  { id: 'm3', user: mockUsers[2], text: 'Best performance of the night so far', timestamp: Date.now() - (60000) },
  { id: 'm4', user: mockUsers[3], text: 'The production is insane 🎬', timestamp: Date.now() - (45000) },
  { id: 'm5', user: mockUsers[4], text: 'Who else is watching from Nairobi? 🇰🇪', timestamp: Date.now() - (30000) },
  { id: 'm6', user: mockUsers[5], text: 'That transition was so smooth!', timestamp: Date.now() - (15000) },
];

const randomChatMessages = [
  'This is so fire 🔥🔥🔥',
  'Best Headies ever!',
  'The stage design though 👏',
  'Watching from South Africa! 🇿🇦',
  'Ngozi killed it!',
  'Who else is from Ghana? 🇬🇭',
  'The energy is unmatched',
  'I can\'t believe what I just saw',
  'Give that man his award already!',
  'This performance > everything',
  'London checking in! 🇬🇧',
  'Afrobeats to the world!',
  'The drums were HEAVY',
  'Goosebumps fr',
  'This is art.',
  'I need that outfit 😍',
  'The dancers are incredible',
  'My ears are blessed',
  'Lagos never disappoints!',
  'When will they perform my fav? 🥺',
];

// ─── Local Storage Helpers ─────────────────────────────────────────────────
function getStoredData<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function setStoredData(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// ─── State Hooks ───────────────────────────────────────────────────────────
export function useStreamData() {
  const [stream, setStream] = useState<StreamData>(() => ({ ...mockStream, viewerCount: mockStream.viewerCount + Math.floor(Math.random() * 200 - 100) }));
  useEffect(() => {
    const iv = setInterval(() => {
      setStream(s => ({
        ...s,
        viewerCount: Math.max(8000, s.viewerCount + Math.floor(Math.random() * 60 - 28)),
        likeCount: s.likeCount + Math.floor(Math.random() * 3),
        commentCount: s.commentCount + Math.floor(Math.random() * 2),
      }));
    }, 4000);
    return () => clearInterval(iv);
  }, []);
  return stream;
}

export function useLikes() {
  const [liked, setLiked] = useState<Record<string, boolean>>(() => getStoredData('feed_likes', {}));
  const [counts, setCounts] = useState<Record<string, number>>(() => getStoredData('feed_counts', {}));
  const toggle = useCallback((id: string, base: number) => {
    setLiked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      setStoredData('feed_likes', next);
      return next;
    });
    setCounts(prev => {
      const next = { ...prev, [id]: (prev[id] ?? base) + (liked[id] ? -1 : 1) };
      setStoredData('feed_counts', next);
      return next;
    });
  }, [liked]);
  return { liked, counts, toggle };
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>(() => getStoredData('feed_bookmarks', {}));
  const toggle = useCallback((id: string) => {
    setBookmarks(prev => {
      const next = { ...prev, [id]: !prev[id] };
      setStoredData('feed_bookmarks', next);
      return next;
    });
  }, []);
  return { bookmarks, toggle };
}

export function useFollows() {
  const [follows, setFollows] = useState<Record<string, boolean>>(() => getStoredData('feed_follows', {}));
  const toggle = useCallback((userId: string) => {
    setFollows(prev => {
      const next = { ...prev, [userId]: !prev[userId] };
      setStoredData('feed_follows', next);
      return next;
    });
  }, []);
  return { follows, toggle };
}

export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages);
  useEffect(() => {
    const iv = setInterval(() => {
      const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const text = randomChatMessages[Math.floor(Math.random() * randomChatMessages.length)];
      setMessages(prev => [...prev.slice(-80), { id: `m${Date.now()}`, user, text, timestamp: Date.now() }]);
    }, 3000 + Math.random() * 4000);
    return () => clearInterval(iv);
  }, []);
  const send = useCallback((text: string) => {
    setMessages(prev => [...prev.slice(-80), { id: `m${Date.now()}`, user: currentUser, text, timestamp: Date.now() }]);
  }, []);
  return { messages, send };
}

export function useComments(initialComments: Comment[]) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const add = useCallback((text: string, parentId?: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      user: currentUser,
      text,
      timestamp: Date.now(),
      likes: 0,
      likedByMe: false,
      replies: [],
    };
    setComments(prev => {
      if (parentId) {
        return prev.map(c => c.id === parentId ? { ...c, replies: [...c.replies, newComment] } : c);
      }
      return [...prev, newComment];
    });
  }, []);
  const remove = useCallback((commentId: string) => {
    setComments(prev => {
      const filtered = prev.filter(c => c.id !== commentId);
      return filtered.map(c => ({ ...c, replies: c.replies.filter(r => r.id !== commentId) }));
    });
  }, []);
  const edit = useCallback((commentId: string, text: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) return { ...c, text };
      return { ...c, replies: c.replies.map(r => r.id === commentId ? { ...r, text } : r) };
    }));
  }, []);
  const likeComment = useCallback((commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) return { ...c, likes: c.likedByMe ? c.likes - 1 : c.likes + 1, likedByMe: !c.likedByMe };
      return { ...c, replies: c.replies.map(r => r.id === commentId ? { ...r, likes: r.likedByMe ? r.likes - 1 : r.likes + 1, likedByMe: !r.likedByMe } : r) };
    }));
  }, []);
  return { comments, add, remove, edit, likeComment };
}

// ─── Time Helpers ──────────────────────────────────────────────────────────
export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Toast System ──────────────────────────────────────────────────────────
export type Toast = { id: string; text: string; icon?: string };

let toastListeners: Array<(toasts: Toast[]) => void> = [];
let toastState: Toast[] = [];

function notify() { toastListeners.forEach(fn => fn([...toastState])); }

export function showToast(text: string, icon?: string) {
  const t: Toast = { id: `t${Date.now()}`, text, icon };
  toastState = [...toastState.slice(-4), t];
  notify();
  setTimeout(() => { toastState = toastState.filter(x => x.id !== t.id); notify(); }, 3000);
}

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>(toastState);
  useEffect(() => { toastListeners.push(setToasts); return () => { toastListeners = toastListeners.filter(fn => fn !== setToasts); }; }, []);
  return toasts;
}
