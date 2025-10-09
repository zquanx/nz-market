import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Eye, MapPin } from 'lucide-react';
import { Item } from '../data/mockItems';
import { getConditionTranslation } from '../data/categoryTranslations';

interface ItemCardProps {
  item: Item;
  language: 'en' | 'zh';
  onToggleFavorite?: (itemId: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, language, onToggleFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(item.isFavorite || false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onToggleFavorite?.(item.id);
  };

  const formatPrice = (price: number, currency: string) => {
    return `${currency} $${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-NZ' : 'zh-CN');
  };

  const getConditionLabel = (condition: string) => {
    return getConditionTranslation(condition, language);
  };

  return (
    <Link to={`/product/${item.id}`} className="block">
      <div className="card hover:shadow-md transition-shadow duration-200 group">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <div className="absolute bottom-3 left-3">
            <span className="bg-white/90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
              {getConditionLabel(item.condition)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {item.title}
          </h3>

          {/* Price */}
          <div className="text-lg font-bold text-primary-600 mb-2">
            {formatPrice(item.price, item.currency)}
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{item.location}</span>
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={item.seller.avatar}
                alt={item.seller.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{item.seller.name}</p>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500">
                    ⭐ {item.seller.rating}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-500">
              <Eye className="w-4 h-4" />
              <span className="text-xs">{item.viewCount}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {language === 'en' ? 'Listed' : '发布于'} {formatDate(item.createdAt)}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Navigate to chat
                window.location.href = `/chat?item=${item.id}`;
              }}
              className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{language === 'en' ? 'Chat' : '聊天'}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
