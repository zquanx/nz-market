# Kiwi Market Frontend

A modern React-based frontend for the Kiwi Market second-hand trading platform, built with TypeScript, Vite, and TailwindCSS.

## Features

- 🏠 **Homepage** - Featured items, categories, and latest listings
- 🔍 **Search & Filter** - Advanced search with category, price, and location filters
- 📱 **Product Details** - Detailed item view with image gallery and seller info
- 💬 **Chat System** - Real-time messaging between buyers and sellers
- 📦 **Sell Items** - Multi-step form for listing new items
- 👤 **User Dashboard** - Manage items, favorites, orders, and reviews
- 🌐 **Bilingual Support** - English and Chinese language support
- ❤️ **Favorites** - Save and manage favorite items
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nz-market-frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser and visit `http://localhost:3000`

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── NavBar.tsx      # Navigation bar
│   ├── ItemCard.tsx    # Product card component
│   ├── FilterBar.tsx   # Search filters
│   ├── ChatWindow.tsx  # Chat interface
│   └── Footer.tsx      # Footer component
├── pages/              # Page components
│   ├── HomePage.tsx    # Homepage
│   ├── SearchPage.tsx  # Search and browse
│   ├── ProductDetailPage.tsx # Product details
│   ├── SellPage.tsx    # Sell item form
│   ├── ChatPage.tsx    # Chat interface
│   └── DashboardPage.tsx # User dashboard
├── data/               # Mock data
│   └── mockItems.ts    # Sample product data
├── types/              # TypeScript type definitions
│   └── index.ts        # Common types
├── styles/             # Global styles
│   └── globals.css     # TailwindCSS imports
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```

## Features Overview

### Homepage
- Hero section with featured items
- Category browsing
- Latest and popular items
- Statistics and trust indicators

### Search & Browse
- Text search with real-time filtering
- Category, condition, and price filters
- Location-based filtering
- Sort by date, price, or popularity
- Grid and list view modes

### Product Details
- Image gallery with thumbnails
- Detailed product information
- Seller profile and rating
- Chat with seller button
- Add to favorites
- Share functionality

### Sell Items
- Multi-step listing form
- Image upload (up to 10 photos)
- Category and condition selection
- Price and location input
- Tag system
- Preview before publishing

### Chat System
- Conversation list
- Real-time messaging interface
- Item context in conversations
- User profiles and ratings
- Message history

### User Dashboard
- Statistics overview
- Manage listed items
- View favorites
- Order history
- Reviews and ratings

## Internationalization

The app supports English and Chinese languages with:
- Language switcher in navigation
- Persistent language preference
- Localized text throughout the interface
- Currency formatting (NZD)

## Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface
- Optimized for all screen sizes

## State Management

- React hooks (useState, useEffect)
- Local storage for preferences
- URL parameters for search state
- Component-level state management

## Styling

- TailwindCSS utility classes
- Custom component classes
- Consistent color scheme
- Responsive typography
- Smooth transitions and hover effects

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
