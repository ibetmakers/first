import React, { useState, useEffect, useRef } from 'react';
import { useMessengerStore } from '../../stores/messengerStore';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'service';
  timestamp: Date;
  isRead: boolean;
}

interface Chat {
  id: string;
  serviceId: string;
  serviceName: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

const EnhancedMessenger: React.FC = () => {
  const { isOpen, closeMessenger, selectedServiceId, selectedServiceName } = useMessengerStore();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      serviceId: '1',
      serviceName: 'Web Development Pro',
      lastMessage: 'Здравствуйте! Готовы обсудить ваш проект.',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 минут назад
      unreadCount: 2,
      messages: [
        {
          id: '1',
          text: 'Здравствуйте! Готовы обсудить ваш проект.',
          sender: 'service',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          isRead: false
        },
        {
          id: '2',
          text: 'Спасибо! Мне нужен сайт для интернет-магазина.',
          sender: 'user',
          timestamp: new Date(Date.now() - 1000 * 60 * 25),
          isRead: true
        },
        {
          id: '3',
          text: 'Отлично! Расскажите подробнее о требованиях.',
          sender: 'service',
          timestamp: new Date(Date.now() - 1000 * 60 * 20),
          isRead: false
        }
      ]
    },
    {
      id: '2',
      serviceId: '2',
      serviceName: 'Design Studio',
      lastMessage: 'Ваш макет готов к просмотру.',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 часа назад
      unreadCount: 1,
      messages: [
        {
          id: '1',
          text: 'Ваш макет готов к просмотру.',
          sender: 'service',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          isRead: false
        }
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Проверяем, авторизован ли пользователь
  const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    return user !== null;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (selectedChat) {
      scrollToBottom();
    }
  }, [selectedChat?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      isRead: false
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, message],
          lastMessage: newMessage,
          lastMessageTime: new Date()
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setSelectedChat(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: newMessage,
      lastMessageTime: new Date()
    } : null);
    setNewMessage('');

    // Имитация ответа от сервиса
    setTimeout(() => {
      const serviceMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Спасибо за сообщение! Мы скоро ответим.',
        sender: 'service',
        timestamp: new Date(),
        isRead: false
      };

      const updatedChatsWithResponse = chats.map(chat => {
        if (chat.id === selectedChat?.id) {
          return {
            ...chat,
            messages: [...chat.messages, serviceMessage],
            lastMessage: serviceMessage.text,
            lastMessageTime: new Date()
          };
        }
        return chat;
      });

      setChats(updatedChatsWithResponse);
      setSelectedChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, serviceMessage],
        lastMessage: serviceMessage.text,
        lastMessageTime: new Date()
      } : null);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}м`;
    if (hours < 24) return `${hours}ч`;
    return `${days}д`;
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[600px] mx-4 flex">
            {/* Список чатов */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Сообщения</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedChat?.id === chat.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {chat.serviceName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {chat.serviceName}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {formatLastMessageTime(chat.lastMessageTime)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {chat.lastMessage}
                          </p>
                        </div>
                      </div>
                      {chat.unreadCount > 0 && (
                        <div className="ml-2">
                          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {chat.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Окно чата */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Заголовок чата */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {selectedChat.serviceName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {selectedChat.serviceName}
                        </h3>
                        <p className="text-xs text-gray-500">Онлайн</p>
                      </div>
                    </div>
                                         <button
                       onClick={closeMessenger}
                       className="text-gray-500 hover:text-gray-700"
                     >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Сообщения */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedChat.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Поле ввода */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Введите сообщение..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-gray-500">Выберите чат для начала общения</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedMessenger; 