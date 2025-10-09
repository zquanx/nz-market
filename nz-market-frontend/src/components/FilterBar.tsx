import React, { useState } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';
import { FilterOptions } from '../types';
import { categories, conditions } from '../data/mockItems';
import { getCategoryTranslation, getConditionTranslation } from '../data/categoryTranslations';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  language: 'en' | 'zh';
  itemCount: number;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  onFiltersChange, 
  language, 
  itemCount 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: 'All',
      condition: '',
      minPrice: 0,
      maxPrice: 0,
      location: '',
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = filters.category !== 'All' || 
                          filters.condition !== '' || 
                          filters.minPrice > 0 || 
                          filters.maxPrice > 0 || 
                          filters.location !== '';

  const sortOptions = [
    { value: 'newest', label: language === 'en' ? 'Newest First' : '最新优先' },
    { value: 'oldest', label: language === 'en' ? 'Oldest First' : '最旧优先' },
    { value: 'price_low', label: language === 'en' ? 'Price: Low to High' : '价格：低到高' },
    { value: 'price_high', label: language === 'en' ? 'Price: High to Low' : '价格：高到低' },
    { value: 'popular', label: language === 'en' ? 'Most Popular' : '最受欢迎' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {language === 'en' ? 'Filter Results' : '筛选结果'}
              </h2>
              <span className="text-sm text-gray-500">
                {itemCount} {language === 'en' ? 'items found' : '个商品'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>{language === 'en' ? 'Clear all' : '清除所有'}</span>
                </button>
              )}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>{language === 'en' ? 'Filters' : '筛选'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {getCategoryTranslation(category, language)}
                </option>
              ))}
            </select>

            {/* Condition Filter */}
            <select
              value={filters.condition}
              onChange={(e) => handleFilterChange('condition', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">{language === 'en' ? 'All Conditions' : '所有成色'}</option>
              {conditions.map(condition => (
                <option key={condition.value} value={condition.value}>
                  {getConditionTranslation(condition.value, language)}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Expanded Filters */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Price Range' : '价格范围'}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder={language === 'en' ? 'Min' : '最低'}
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="number"
                    placeholder={language === 'en' ? 'Max' : '最高'}
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Location' : '位置'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Enter city or suburb' : '输入城市或区域'}
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Active Filters Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Active Filters' : '当前筛选'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {filters.category !== 'All' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                      {getCategoryTranslation(filters.category, language)}
                      <button
                        onClick={() => handleFilterChange('category', 'All')}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.condition && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                      {getConditionTranslation(filters.condition, language)}
                      <button
                        onClick={() => handleFilterChange('condition', '')}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {(filters.minPrice > 0 || filters.maxPrice > 0) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                      ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                      <button
                        onClick={() => {
                          handleFilterChange('minPrice', 0);
                          handleFilterChange('maxPrice', 0);
                        }}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.location && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                      {filters.location}
                      <button
                        onClick={() => handleFilterChange('location', '')}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
