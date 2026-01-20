
export interface User {
  id: string;
  name: string;
  avatar: string;
  coverPhoto?: string;
  bio?: string;
  friendsCount?: number;
  // Enhanced "About" fields
  workplace?: string;
  education?: string;
  currentCity?: string;
  hometown?: string;
  relationshipStatus?: string;
}

export type ReactionType = 'like' | 'love' | 'care' | 'haha' | 'wow' | 'sad' | 'angry';

export interface Reaction {
  type: ReactionType;
  count: number;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  likes: number;
  reactions?: Reaction[];
  replies?: Comment[];
}

export interface Post {
  id: string;
  user: User;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  reactions: Reaction[];
  commentsCount: number;
  commentsList: Comment[];
  shares: number;
}

export interface Story {
  id: string;
  user: User;
  image: string;
  viewCount: number;
  reactions: Reaction[];
  timestamp: string;
}

export interface AppNotification {
  id: string;
  user: User;
  type: 'like' | 'comment' | 'post' | 'friend_request' | 'mention';
  content: string;
  timestamp: string;
  isRead: boolean;
  targetId?: string; // ID of the Post, User, or Comment
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text?: string;
  image?: string;
  audio?: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  user: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
  isOnline: boolean;
  isBot?: boolean;
}

export interface GeminiEditResponse {
  imageUrl?: string;
  error?: string;
}
