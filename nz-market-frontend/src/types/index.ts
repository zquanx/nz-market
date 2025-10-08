export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  location?: string;
  rating: number;
  memberSince: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image';
}

export interface Conversation {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  otherUser: User;
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export interface FilterOptions {
  category: string;
  condition: string;
  minPrice: number;
  maxPrice: number;
  location: string;
  sortBy: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'popular';
}

export interface Language {
  code: 'en' | 'zh';
  name: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
}
