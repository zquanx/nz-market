import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp, Clock, MapPin } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import { mockItems, categories } from '../data/mockItems';
import { Item } from '../data/mockItems';

interface HomePageProps {
  language: 'en' | 'zh';
  onToggleFavorite: (itemId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ language, onToggleFavorite }) => {
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  const [latestItems, setLatestItems] = useState<Item[]>([]);
  const [popularItems, setPopularItems] = useState<Item[]>([]);

  useEffect(() => {
    // Simulate API calls
    setFeaturedItems(mockItems.slice(0, 4));
    setLatestItems(mockItems.slice(0, 6));
    setPopularItems(mockItems.slice(2, 8));
  }, []);

  const stats = [
    {
      icon: TrendingUp,
      value: '10,000+',
      label: language === 'en' ? 'Active Listings' : '活跃商品'
    },
    {
      icon: Star,
      value: '4.8',
      label: language === 'en' ? 'User Rating' : '用户评分'
    },
    {
      icon: Clock,
      value: '24/7',
      label: language === 'en' ? 'Support' : '支持'
    },
    {
      icon: MapPin,
      value: 'NZ Wide',
      label: language === 'en' ? 'Coverage' : '覆盖范围'
    }
  ];

  const heroContent = {
    en: {
      title: 'Find Amazing Deals on Second-hand Items',
      subtitle: 'Buy and sell pre-loved items in your local community. Safe, secure, and sustainable.',
      cta: 'Start Shopping',
      browse: 'Browse Categories'
    },
    zh: {
      title: '发现二手商品的超值优惠',
      subtitle: '在您的本地社区买卖二手商品。安全、可靠、可持续。',
      cta: '开始购物',
      browse: '浏览分类'
    }
  };

  const content = heroContent[language];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {content.title}
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                {content.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/search"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {content.cta}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/search"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
                >
                  {content.browse}
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {featuredItems.slice(0, 4).map((item, index) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-xl p-4 shadow-lg transform transition-transform hover:scale-105 ${
                      index === 0 ? 'col-span-2' : ''
                    }`}
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className={`w-full object-cover rounded-lg mb-3 ${
                        index === 0 ? 'h-32' : 'h-24'
                      }`}
                    />
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-primary-600 font-bold">
                      {item.currency} ${item.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Shop by Category' : '按分类购物'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Discover items in your favorite categories'
                : '在您喜欢的分类中发现商品'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(1).map((category, index) => (
              <Link
                key={category}
                to={`/search?category=${encodeURIComponent(category)}`}
                className="group bg-white rounded-xl p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <span className="text-primary-600 font-bold text-lg">
                    {category.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {category}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Items Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'en' ? 'Latest Listings' : '最新商品'}
              </h2>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Fresh items just added to the marketplace'
                  : '刚刚添加到市场的全新商品'
                }
              </p>
            </div>
            <Link
              to="/search?sort=newest"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
            >
              {language === 'en' ? 'View All' : '查看全部'}
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {latestItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                language={language}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Items Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'en' ? 'Popular This Week' : '本周热门'}
              </h2>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Most viewed and favorited items'
                  : '最受关注和收藏的商品'
                }
              </p>
            </div>
            <Link
              to="/search?sort=popular"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
            >
              {language === 'en' ? 'View All' : '查看全部'}
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {popularItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                language={language}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'en' ? 'Ready to Start Selling?' : '准备开始出售？'}
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Join thousands of Kiwis who are making money by selling their unused items.'
              : '加入成千上万通过出售闲置物品赚钱的新西兰人。'
            }
          </p>
          <Link
            to="/sell"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            {language === 'en' ? 'List Your First Item' : '发布您的第一个商品'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
