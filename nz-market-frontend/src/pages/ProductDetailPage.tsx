import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Calendar, 
  Eye, 
  Star,
  ChevronLeft,
  ChevronRight,
  Flag
} from 'lucide-react';
import { mockItems } from '../data/mockItems';
import { Item } from '../data/mockItems';

interface ProductDetailPageProps {
  language: 'en' | 'zh';
  onToggleFavorite: (itemId: string) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ language, onToggleFavorite }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (id) {
      const foundItem = mockItems.find(i => i.id === id);
      if (foundItem) {
        setItem(foundItem);
        setIsFavorite(foundItem.isFavorite || false);
      } else {
        navigate('/search');
      }
    }
  }, [id, navigate]);

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'en' ? 'Loading...' : '加载中...'}
          </p>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    onToggleFavorite(item.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === item.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? item.images.length - 1 : prev - 1
    );
  };

  const formatPrice = (price: number, currency: string) => {
    return `${currency} $${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-NZ' : 'zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getConditionLabel = (condition: string) => {
    const labels = {
      NEW: language === 'en' ? 'New' : '全新',
      LIKE_NEW: language === 'en' ? 'Like New' : '几乎全新',
      GOOD: language === 'en' ? 'Good' : '良好',
      FAIR: language === 'en' ? 'Fair' : '一般'
    };
    return labels[condition as keyof typeof labels] || condition;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          {language === 'en' ? 'Back' : '返回'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm">
              <img
                src={item.images[currentImageIndex]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              
              {item.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-sm transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 p-2 rounded-full shadow-sm transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-full shadow-sm transition-colors ${
                    isFavorite
                      ? 'bg-red-500 text-white'
                      : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-white/80 text-gray-600 hover:bg-white hover:text-gray-700 rounded-full shadow-sm transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white/80 text-gray-600 hover:bg-white hover:text-gray-700 rounded-full shadow-sm transition-colors">
                  <Flag className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Thumbnail Images */}
            {item.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex
                        ? 'border-primary-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {item.title}
              </h1>
              <div className="text-4xl font-bold text-primary-600 mb-4">
                {formatPrice(item.price, item.currency)}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="bg-gray-100 px-3 py-1 rounded-full">
                  {getConditionLabel(item.condition)}
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {item.viewCount} {language === 'en' ? 'views' : '次浏览'}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {language === 'en' ? 'Listed' : '发布于'} {formatDate(item.createdAt)}
                </span>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">
                {language === 'en' ? 'Seller Information' : '卖家信息'}
              </h3>
              <div className="flex items-center space-x-4">
                <img
                  src={item.seller.avatar}
                  alt={item.seller.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{item.seller.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1">{item.seller.rating}</span>
                    </div>
                    <span>•</span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {item.location}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/chat?item=${item.id}`)}
                  className="btn-primary"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Chat' : '聊天'}
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">
                {language === 'en' ? 'Description' : '商品描述'}
              </h3>
              <div className="text-gray-700 leading-relaxed">
                {showFullDescription ? (
                  <p>{item.description}</p>
                ) : (
                  <p>
                    {item.description.length > 200
                      ? `${item.description.substring(0, 200)}...`
                      : item.description
                    }
                  </p>
                )}
                {item.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-primary-600 hover:text-primary-700 font-medium mt-2"
                  >
                    {showFullDescription
                      ? (language === 'en' ? 'Show less' : '显示更少')
                      : (language === 'en' ? 'Show more' : '显示更多')
                    }
                  </button>
                )}
              </div>
            </div>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {language === 'en' ? 'Tags' : '标签'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/chat?item=${item.id}`)}
                className="w-full btn-primary text-lg py-3"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Chat with Seller' : '与卖家聊天'}
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  isFavorite
                    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-5 h-5 mr-2 inline ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite
                  ? (language === 'en' ? 'Remove from Favorites' : '从收藏中移除')
                  : (language === 'en' ? 'Add to Favorites' : '添加到收藏')
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
