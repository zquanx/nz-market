import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Smile, Phone, Video, MoreVertical } from 'lucide-react';
import { ChatMessage, User } from '../types';

interface ChatWindowProps {
  conversationId: string;
  otherUser: User;
  itemTitle: string;
  itemImage: string;
  language: 'en' | 'zh';
  onSendMessage?: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  otherUser,
  itemTitle,
  itemImage,
  language,
  onSendMessage
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: otherUser.id,
      content: language === 'en' ? 'Hi! Is this item still available?' : '你好！这个商品还在吗？',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'text'
    },
    {
      id: '2',
      senderId: 'current-user',
      content: language === 'en' ? 'Yes, it is! Are you interested?' : '是的，还在！你有兴趣吗？',
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      type: 'text'
    },
    {
      id: '3',
      senderId: otherUser.id,
      content: language === 'en' ? 'Great! Can we meet this weekend?' : '太好了！我们这周末能见面吗？',
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      type: 'text'
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'current-user',
        content: message.trim(),
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      onSendMessage?.(message.trim());
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(language === 'en' ? 'en-NZ' : 'zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return language === 'en' ? 'Today' : '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return language === 'en' ? 'Yesterday' : '昨天';
    } else {
      return date.toLocaleDateString(language === 'en' ? 'en-NZ' : 'zh-CN');
    }
  };

  const shouldShowDate = (index: number) => {
    if (index === 0) return true;
    const currentDate = new Date(messages[index].timestamp).toDateString();
    const previousDate = new Date(messages[index - 1].timestamp).toDateString();
    return currentDate !== previousDate;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <img
            src={otherUser.avatar}
            alt={otherUser.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
            <p className="text-sm text-gray-500">
              ⭐ {otherUser.rating} • {otherUser.location}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Item Info */}
      <div className="p-4 border-b border-gray-200 bg-blue-50">
        <div className="flex items-center space-x-3">
          <img
            src={itemImage}
            alt={itemTitle}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">{itemTitle}</p>
            <p className="text-xs text-gray-500">
              {language === 'en' ? 'Discussing this item' : '正在讨论此商品'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={msg.id}>
            {shouldShowDate(index) && (
              <div className="flex justify-center mb-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {formatDate(msg.timestamp)}
                </span>
              </div>
            )}
            
            <div className={`flex ${msg.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-xs lg:max-w-md ${msg.senderId === 'current-user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.senderId !== 'current-user' && (
                  <img
                    src={otherUser.avatar}
                    alt={otherUser.name}
                    className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0"
                  />
                )}
                
                <div className={`px-4 py-2 rounded-2xl ${
                  msg.senderId === 'current-user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    msg.senderId === 'current-user' ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Image className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Smile className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={language === 'en' ? 'Type a message...' : '输入消息...'}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
