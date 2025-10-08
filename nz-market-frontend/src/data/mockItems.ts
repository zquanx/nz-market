export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR';
  category: string;
  location: string;
  seller: {
    name: string;
    avatar: string;
    rating: number;
  };
  images: string[];
  tags: string[];
  createdAt: string;
  viewCount: number;
  isFavorite?: boolean;
}

export const mockItems: Item[] = [
  {
    id: '1',
    title: 'MacBook Pro 13" 2020 - Excellent Condition',
    description: 'Selling my MacBook Pro 13" 2020 model. It\'s in excellent condition with no scratches or dents. Comes with original charger and box. Perfect for students or professionals.',
    price: 1200,
    currency: 'NZD',
    condition: 'LIKE_NEW',
    category: 'Electronics',
    location: 'Auckland CBD',
    seller: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 4.8
    },
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop'
    ],
    tags: ['laptop', 'apple', 'macbook', 'computer'],
    createdAt: '2024-01-15T10:30:00Z',
    viewCount: 156
  },
  {
    id: '2',
    title: 'Vintage Leather Jacket - Size M',
    description: 'Beautiful vintage leather jacket in brown. Genuine leather, well-maintained. Perfect for autumn/winter. Size Medium fits 38-40 chest.',
    price: 180,
    currency: 'NZD',
    condition: 'GOOD',
    category: 'Fashion',
    location: 'Wellington',
    seller: {
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.6
    },
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop'
    ],
    tags: ['jacket', 'leather', 'vintage', 'fashion'],
    createdAt: '2024-01-14T15:45:00Z',
    viewCount: 89
  },
  {
    id: '3',
    title: 'Nintendo Switch with 3 Games',
    description: 'Nintendo Switch console in great condition. Includes 3 popular games: Mario Kart 8, Animal Crossing, and Zelda. All original accessories included.',
    price: 450,
    currency: 'NZD',
    condition: 'LIKE_NEW',
    category: 'Gaming',
    location: 'Christchurch',
    seller: {
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 4.9
    },
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop'
    ],
    tags: ['nintendo', 'switch', 'gaming', 'console'],
    createdAt: '2024-01-13T09:20:00Z',
    viewCount: 234
  },
  {
    id: '4',
    title: 'Road Bike - Trek Domane SL5',
    description: 'Excellent road bike for commuting and weekend rides. Well-maintained, recently serviced. Carbon frame, Shimano 105 groupset. Size 56cm.',
    price: 1800,
    currency: 'NZD',
    condition: 'GOOD',
    category: 'Sports',
    location: 'Dunedin',
    seller: {
      name: 'David Park',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 4.7
    },
    images: [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop'
    ],
    tags: ['bike', 'road', 'cycling', 'trek'],
    createdAt: '2024-01-12T14:15:00Z',
    viewCount: 67
  },
  {
    id: '5',
    title: 'KitchenAid Stand Mixer - Red',
    description: 'KitchenAid Artisan stand mixer in beautiful red color. 5-quart bowl, includes dough hook, whisk, and paddle. Perfect for baking enthusiasts.',
    price: 320,
    currency: 'NZD',
    condition: 'LIKE_NEW',
    category: 'Home & Garden',
    location: 'Hamilton',
    seller: {
      name: 'Lisa Brown',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      rating: 4.8
    },
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'
    ],
    tags: ['kitchen', 'mixer', 'baking', 'kitchenaid'],
    createdAt: '2024-01-11T11:30:00Z',
    viewCount: 123
  },
  {
    id: '6',
    title: 'Canon EOS R5 Camera Body',
    description: 'Professional mirrorless camera body. Excellent condition, low shutter count. Perfect for photography enthusiasts and professionals.',
    price: 2800,
    currency: 'NZD',
    condition: 'LIKE_NEW',
    category: 'Electronics',
    location: 'Auckland',
    seller: {
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      rating: 4.9
    },
    images: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop'
    ],
    tags: ['camera', 'canon', 'photography', 'mirrorless'],
    createdAt: '2024-01-10T16:45:00Z',
    viewCount: 189
  },
  {
    id: '7',
    title: 'Designer Handbag - Louis Vuitton',
    description: 'Authentic Louis Vuitton handbag in excellent condition. Classic design, perfect for special occasions. Comes with authenticity card.',
    price: 1200,
    currency: 'NZD',
    condition: 'GOOD',
    category: 'Fashion',
    location: 'Auckland CBD',
    seller: {
      name: 'Sophie Lee',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      rating: 4.7
    },
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop'
    ],
    tags: ['handbag', 'louis vuitton', 'designer', 'luxury'],
    createdAt: '2024-01-09T13:20:00Z',
    viewCount: 278
  },
  {
    id: '8',
    title: 'Guitar - Fender Stratocaster',
    description: 'Classic Fender Stratocaster electric guitar. Sunburst finish, excellent condition. Perfect for beginners and experienced players alike.',
    price: 650,
    currency: 'NZD',
    condition: 'GOOD',
    category: 'Musical Instruments',
    location: 'Wellington',
    seller: {
      name: 'Tom Anderson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.6
    },
    images: [
      'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400&h=300&fit=crop'
    ],
    tags: ['guitar', 'fender', 'electric', 'music'],
    createdAt: '2024-01-08T10:15:00Z',
    viewCount: 145
  },
  {
    id: '9',
    title: 'Coffee Table - Modern Design',
    description: 'Beautiful modern coffee table with glass top and wooden legs. Perfect for living room. Some minor wear but overall good condition.',
    price: 180,
    currency: 'NZD',
    condition: 'FAIR',
    category: 'Furniture',
    location: 'Christchurch',
    seller: {
      name: 'Rachel Green',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 4.5
    },
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
    ],
    tags: ['table', 'coffee', 'furniture', 'modern'],
    createdAt: '2024-01-07T14:30:00Z',
    viewCount: 78
  },
  {
    id: '10',
    title: 'Ski Equipment Set - Complete Package',
    description: 'Complete ski equipment set including skis, boots, poles, and helmet. All in good condition, perfect for winter sports enthusiasts.',
    price: 450,
    currency: 'NZD',
    condition: 'GOOD',
    category: 'Sports',
    location: 'Queenstown',
    seller: {
      name: 'James Miller',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 4.8
    },
    images: [
      'https://images.unsplash.com/photo-1551524164-6cf2ac531d83?w=400&h=300&fit=crop'
    ],
    tags: ['ski', 'winter', 'sports', 'equipment'],
    createdAt: '2024-01-06T12:00:00Z',
    viewCount: 92
  }
];

export const categories = [
  'All',
  'Electronics',
  'Fashion',
  'Gaming',
  'Sports',
  'Home & Garden',
  'Musical Instruments',
  'Furniture',
  'Books',
  'Toys & Games'
];

export const conditions = [
  { value: 'NEW', label: 'New' },
  { value: 'LIKE_NEW', label: 'Like New' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' }
];
