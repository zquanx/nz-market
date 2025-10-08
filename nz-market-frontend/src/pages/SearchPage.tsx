import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Grid, List, SlidersHorizontal } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import FilterBar from '../components/FilterBar';
import { mockItems, categories } from '../data/mockItems';
import { Item } from '../data/mockItems';
import { FilterOptions } from '../types';

interface SearchPageProps {
  language: 'en' | 'zh';
  onToggleFavorite: (itemId: string) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ language, onToggleFavorite }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterOptions>({
    category: searchParams.get('category') || 'All',
    condition: searchParams.get('condition') || '',
    minPrice: parseInt(searchParams.get('minPrice') || '0') || 0,
    maxPrice: parseInt(searchParams.get('maxPrice') || '0') || 0,
    location: searchParams.get('location') || '',
    sortBy: (searchParams.get('sort') as any) || 'newest'
  });

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let items = [...mockItems];

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'All') {
      items = items.filter(item => item.category === filters.category);
    }

    // Condition filter
    if (filters.condition) {
      items = items.filter(item => item.condition === filters.condition);
    }

    // Price range filter
    if (filters.minPrice > 0) {
      items = items.filter(item => item.price >= filters.minPrice);
    }
    if (filters.maxPrice > 0) {
      items = items.filter(item => item.price <= filters.maxPrice);
    }

    // Location filter
    if (filters.location) {
      const location = filters.location.toLowerCase();
      items = items.filter(item =>
        item.location.toLowerCase().includes(location)
      );
    }

    // Sort items
    switch (filters.sortBy) {
      case 'newest':
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price_low':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        items.sort((a, b) => b.viewCount - a.viewCount);
        break;
    }

    return items;
  }, [searchQuery, filters]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (filters.category && filters.category !== 'All') params.set('category', filters.category);
    if (filters.condition) params.set('condition', filters.condition);
    if (filters.minPrice > 0) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice > 0) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.location) params.set('location', filters.location);
    if (filters.sortBy !== 'newest') params.set('sort', filters.sortBy);
    
    setSearchParams(params);
  }, [searchQuery, filters, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the useEffect above
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilters({
      category: 'All',
      condition: '',
      minPrice: 0,
      maxPrice: 0,
      location: '',
      sortBy: 'newest'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 max-w-2xl">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Search for items...' : '搜索商品...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                />
              </form>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
              
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {searchQuery ? (
                <span>
                  {language === 'en' 
                    ? `Found ${filteredItems.length} results for "${searchQuery}"`
                    : `找到 ${filteredItems.length} 个"${searchQuery}"的结果`
                  }
                </span>
              ) : (
                <span>
                  {language === 'en' 
                    ? `Showing ${filteredItems.length} items`
                    : `显示 ${filteredItems.length} 个商品`
                  }
                </span>
              )}
            </div>
            
            {(searchQuery || Object.values(filters).some(v => v && v !== 'All' && v !== 'newest')) && (
              <button
                onClick={clearSearch}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {language === 'en' ? 'Clear all' : '清除所有'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <FilterBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          language={language}
          itemCount={filteredItems.length}
        />
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'en' ? 'No items found' : '未找到商品'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'en' 
                ? 'Try adjusting your search or filter criteria'
                : '尝试调整您的搜索或筛选条件'
              }
            </p>
            <button
              onClick={clearSearch}
              className="btn-primary"
            >
              {language === 'en' ? 'Clear filters' : '清除筛选'}
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                language={language}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
