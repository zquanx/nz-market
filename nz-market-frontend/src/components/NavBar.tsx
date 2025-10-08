import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, MessageCircle, User, Menu, X, Globe } from 'lucide-react';
import { Language } from '../types';

interface NavBarProps {
  currentLanguage: 'en' | 'zh';
  onLanguageChange: (lang: 'en' | 'zh') => void;
}

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' }
];

const NavBar: React.FC<NavBarProps> = ({ currentLanguage, onLanguageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Kiwi Market</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={currentLanguage === 'en' ? 'Search for items...' : '搜索商品...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/search"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              {currentLanguage === 'en' ? 'Browse' : '浏览'}
            </Link>
            <Link
              to="/sell"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              {currentLanguage === 'en' ? 'Sell' : '出售'}
            </Link>
            <Link
              to="/chat"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              {currentLanguage === 'en' ? 'Messages' : '消息'}
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => onLanguageChange(currentLanguage === 'en' ? 'zh' : 'en')}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {currentLanguage === 'en' ? 'EN' : '中文'}
                </span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/favorites"
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Heart className="w-5 h-5" />
              </Link>
              <Link
                to="/chat"
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </Link>
              <Link
                to="/me"
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={currentLanguage === 'en' ? 'Search for items...' : '搜索商品...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/search"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {currentLanguage === 'en' ? 'Browse' : '浏览'}
              </Link>
              <Link
                to="/sell"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {currentLanguage === 'en' ? 'Sell' : '出售'}
              </Link>
              <Link
                to="/chat"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {currentLanguage === 'en' ? 'Messages' : '消息'}
              </Link>
              <Link
                to="/favorites"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {currentLanguage === 'en' ? 'Favorites' : '收藏'}
              </Link>
              <Link
                to="/me"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {currentLanguage === 'en' ? 'Profile' : '个人资料'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
