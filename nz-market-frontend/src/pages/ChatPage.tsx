import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MessageCircle, Star, Clock, Filter } from 'lucide-react';
import ChatWindow from '../components/ChatWindow';
import { mockItems } from '../data/mockItems';
import { Conversation, User } from '../types';

interface ChatPageProps {
  language: 'en' | 'zh';
}

const ChatPage: React.FC<ChatPageProps> = ({ language }) => {
  const [searchParams] = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Mock conversations data
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: '1',
        itemId: '1',
        itemTitle: 'MacBook Pro 13" 2020 - Excellent Condition',
        itemImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
        otherUser: {
          id: 'user1',
          name: 'Sarah Chen',
          email: 'sarah@example.com',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          location: 'Auckland CBD',
          rating: 4.8,
          memberSince: '2023-01-15'
        },
        lastMessage: {
          id: 'msg1',
          senderId: 'user1',
          content: language === 'en' ? 'Great! Can we meet this weekend?' : '太好了！我们这周末能见面吗？',
          timestamp: new Date(Date.now() - 3000000).toISOString(),
          type: 'text'
        },
        unreadCount: 2
      },
      {
        id: '2',
        itemId: '2',
        itemTitle: 'Vintage Leather Jacket - Size M',
        itemImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
        otherUser: {
          id: 'user2',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          location: 'Wellington',
          rating: 4.6,
          memberSince: '2023-03-20'
        },
        lastMessage: {
          id: 'msg2',
          senderId: 'current-user',
          content: language === 'en' ? 'Yes, it\'s still available!' : '是的，还在！',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          type: 'text'
        },
        unreadCount: 0
      },
      {
        id: '3',
        itemId: '3',
        itemTitle: 'Nintendo Switch with 3 Games',
        itemImage: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
        otherUser: {
          id: 'user3',
          name: 'Emma Wilson',
          email: 'emma@example.com',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          location: 'Christchurch',
          rating: 4.9,
          memberSince: '2023-02-10'
        },
        lastMessage: {
          id: 'msg3',
          senderId: 'user3',
          content: language === 'en' ? 'Perfect! I\'ll take it.' : '完美！我要了。',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          type: 'text'
        },
        unreadCount: 1
      }
    ];

    setConversations(mockConversations);
    
    // Set initial conversation if itemId is provided
    const itemId = searchParams.get('item');
    if (itemId) {
      const conversation = mockConversations.find(c => c.itemId === itemId);
      if (conversation) {
        setSelectedConversation(conversation.id);
      }
    } else if (mockConversations.length > 0) {
      setSelectedConversation(mockConversations[0].id);
    }
  }, [searchParams, language]);

  const filteredConversations = conversations.filter(conversation =>
    conversation.itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return language === 'en' ? 'Just now' : '刚刚';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else if (diffInHours < 48) {
      return language === 'en' ? 'Yesterday' : '昨天';
    } else {
      return date.toLocaleDateString(language === 'en' ? 'en-NZ' : 'zh-CN');
    }
  };

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
    // Here you would typically send the message to your backend
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'en' ? 'Messages' : '消息'}
          </h1>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Chat with buyers and sellers'
              : '与买家和卖家聊天'
            }
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex h-[600px]">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={language === 'en' ? 'Search conversations...' : '搜索对话...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">
                      {language === 'en' ? 'No conversations found' : '未找到对话'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedConversation === conversation.id ? 'bg-primary-50 border-r-2 border-primary-500' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <img
                            src={conversation.itemImage}
                            alt={conversation.itemTitle}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {conversation.otherUser.name}
                              </h3>
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-gray-500">
                                  {formatTime(conversation.lastMessage?.timestamp || '')}
                                </span>
                                {conversation.unreadCount > 0 && (
                                  <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                    {conversation.unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-1 line-clamp-1">
                              {conversation.itemTitle}
                            </p>
                            {conversation.lastMessage && (
                              <p className="text-sm text-gray-700 line-clamp-2">
                                {conversation.lastMessage.content}
                              </p>
                            )}
                            <div className="flex items-center mt-2 space-x-2">
                              <div className="flex items-center text-xs text-gray-500">
                                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                                {conversation.otherUser.rating}
                              </div>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">
                                {conversation.otherUser.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
              {selectedConv ? (
                <ChatWindow
                  conversationId={selectedConv.id}
                  otherUser={selectedConv.otherUser}
                  itemTitle={selectedConv.itemTitle}
                  itemImage={selectedConv.itemImage}
                  language={language}
                  onSendMessage={handleSendMessage}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {language === 'en' ? 'Select a conversation' : '选择一个对话'}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'en' 
                        ? 'Choose a conversation from the list to start chatting'
                        : '从列表中选择一个对话开始聊天'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
