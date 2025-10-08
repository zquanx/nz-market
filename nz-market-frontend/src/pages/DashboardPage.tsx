import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Heart, 
  MessageCircle, 
  Eye, 
  Edit, 
  Trash2, 
  Star,
  Package,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';
import { mockItems } from '../data/mockItems';
import { Item } from '../data/mockItems';

interface DashboardPageProps {
  language: 'en' | 'zh';
  onToggleFavorite: (itemId: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ language, onToggleFavorite }) => {
  const [activeTab, setActiveTab] = useState<'items' | 'favorites' | 'orders' | 'reviews'>('items');
  
  // Mock user data
  const userStats = {
    totalItems: 12,
    totalViews: 1250,
    totalFavorites: 45,
    totalSales: 8
  };

  // Mock user items (items where current user is the seller)
  const userItems = mockItems.slice(0, 6).map(item => ({
    ...item,
    seller: {
      name: 'You',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 4.9
    }
  }));

  // Mock favorite items
  const favoriteItems = mockItems.filter((_, index) => index % 2 === 0);

  // Mock orders
  const orders = [
    {
      id: '1',
      item: mockItems[0],
      buyer: {
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        rating: 4.8
      },
      status: 'completed',
      date: '2024-01-15',
      amount: 1200
    },
    {
      id: '2',
      item: mockItems[1],
      buyer: {
        name: 'Mike Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        rating: 4.6
      },
      status: 'pending',
      date: '2024-01-14',
      amount: 180
    }
  ];

  const tabs = [
    { id: 'items', label: language === 'en' ? 'My Items' : '我的商品', icon: Package },
    { id: 'favorites', label: language === 'en' ? 'Favorites' : '收藏', icon: Heart },
    { id: 'orders', label: language === 'en' ? 'Orders' : '订单', icon: TrendingUp },
    { id: 'reviews', label: language === 'en' ? 'Reviews' : '评价', icon: Star }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'items':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {language === 'en' ? 'My Items' : '我的商品'}
              </h2>
              <Link
                to="/sell"
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Add New Item' : '添加新商品'}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userItems.map((item) => (
                <div key={item.id} className="card">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <button className="p-2 bg-white/80 text-gray-600 hover:bg-white hover:text-primary-600 rounded-full transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/80 text-gray-600 hover:bg-white hover:text-red-500 rounded-full transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-white/90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="text-lg font-bold text-primary-600 mb-2">
                      {item.currency} ${item.price.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{item.viewCount}</span>
                      </div>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Favorite Items' : '收藏的商品'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteItems.map((item) => (
                <div key={item.id} className="card">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => onToggleFavorite(item.id)}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="text-lg font-bold text-primary-600 mb-2">
                      {item.currency} ${item.price.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{item.seller.name}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Recent Orders' : '最近订单'}
            </h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="card p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={order.item.images[0]}
                      alt={order.item.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {order.item.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{order.currency} ${order.amount.toLocaleString()}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <img
                        src={order.buyer.avatar}
                        alt={order.buyer.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{order.buyer.name}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                          {order.buyer.rating}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Reviews' : '评价'}
            </h2>
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'en' ? 'No reviews yet' : '暂无评价'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Reviews from buyers will appear here'
                  : '买家的评价将显示在这里'
                }
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'en' ? 'My Dashboard' : '我的仪表板'}
          </h1>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Manage your items, orders, and account'
              : '管理您的商品、订单和账户'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {language === 'en' ? 'Total Items' : '总商品数'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{userStats.totalItems}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {language === 'en' ? 'Total Views' : '总浏览数'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{userStats.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {language === 'en' ? 'Favorites' : '收藏数'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{userStats.totalFavorites}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {language === 'en' ? 'Total Sales' : '总销售数'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{userStats.totalSales}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
