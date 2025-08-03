import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, ChevronLeft, MoreVertical, Paperclip, MessageCircle } from 'lucide-react';
import { useMessengerStore } from '../../stores/messengerStore';
import { useAuthStore } from '../../stores/authStore';
import MessageBubble from './MessageBubble';

const ChatWindow: React.FC = () => {
  const { 
    currentChat, 
    messages, 
    sendMessage, 
    isLoading, 
    error,
    setCurrentChat 
  } = useMessengerStore();
  const { user } = useAuthStore();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat || !user) return;

    const otherParticipant = currentChat.participants.find(p => p._id !== user._id);
    if (!otherParticipant) return;

    try {
      await sendMessage(otherParticipant._id, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
    }
  };

  const getOtherParticipant = () => {
    if (!currentChat || !user) return null;
    return currentChat.participants.find(p => p._id !== user._id);
  };

  if (!currentChat) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Выберите чат</h3>
          <p className="text-sm">Начните общение с сервисами</p>
        </div>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant();

  return (
    <div className="h-full flex flex-col">
      {/* Заголовок чата */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentChat(null)}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {otherParticipant?.profile?.name?.charAt(0) || '?'}
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900">
              {otherParticipant?.profile?.name || otherParticipant?.username || 'Неизвестный пользователь'}
            </h3>
            <p className="text-sm text-gray-500">
              {otherParticipant?.username}
            </p>
          </div>
        </div>
        
        <button className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-4">
            <p>Ошибка загрузки сообщений: {error}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            <p>Нет сообщений</p>
            <p className="text-sm">Начните общение первым сообщением</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwnMessage={message.sender._id === user?._id}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Форма отправки сообщения */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Введите сообщение..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          
          <motion.button
            type="submit"
            disabled={!newMessage.trim() || isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-full transition-colors ${
              newMessage.trim() && !isLoading
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow; 