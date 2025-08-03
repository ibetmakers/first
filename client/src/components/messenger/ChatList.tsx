import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, MessageCircle } from 'lucide-react';
import { useMessengerStore } from '../../stores/messengerStore';
import { useAuthStore } from '../../stores/authStore';

const ChatList: React.FC = () => {
  const { 
    chats, 
    currentChat, 
    setCurrentChat, 
    loadChats, 
    isLoading, 
    error 
  } = useMessengerStore();
  const { user } = useAuthStore();

  useEffect(() => {
    loadChats();
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 48) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const getOtherParticipant = (chat: any) => {
    return chat.participants.find((p: any) => p._id !== user?._id);
  };

  const getLastMessagePreview = (content: string) => {
    if (content.length > 50) {
      return content.substring(0, 50) + '...';
    }
    return content;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Ошибка загрузки чатов: {error}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Заголовок */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Сообщения</h2>
          <button className="p-1 text-gray-500 hover:text-blue-600 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        {/* Поиск */}
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск в чатах..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Список чатов */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Нет активных чатов</p>
            <p className="text-sm">Начните общение с сервисами</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {chats.map((chat) => {
              const otherParticipant = getOtherParticipant(chat);
              const isActive = currentChat?._id === chat._id;
              
              return (
                <motion.div
                  key={chat._id}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  className={`cursor-pointer transition-colors duration-200 ${
                    isActive ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                  onClick={() => setCurrentChat(chat)}
                >
                  <div className="p-4">
                    <div className="flex items-center space-x-3">
                      {/* Аватар */}
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {otherParticipant?.profile?.name?.charAt(0) || '?'}
                        </div>
                        {chat.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                            {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                          </div>
                        )}
                      </div>

                      {/* Информация о чате */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {otherParticipant?.profile?.name || otherParticipant?.username || 'Неизвестный пользователь'}
                          </h3>
                          {chat.lastMessage && (
                            <span className="text-xs text-gray-500">
                              {formatTime(chat.lastMessage.timestamp)}
                            </span>
                          )}
                        </div>
                        
                        {chat.lastMessage ? (
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {getLastMessagePreview(chat.lastMessage.content)}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400 italic mt-1">
                            Нет сообщений
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList; 