import React from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCheck } from 'lucide-react';
import { Message } from '../../api/messages';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageStatus = () => {
    if (message.isRead) {
      return <CheckCheck className="w-4 h-4 text-blue-500" />;
    }
    return <Check className="w-4 h-4 text-gray-400" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        {/* Аватар для чужих сообщений */}
        {!isOwnMessage && (
          <div className="flex items-end mb-1">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-2">
              {message.sender.profile.name?.charAt(0) || '?'}
            </div>
          </div>
        )}

        {/* Пузырек сообщения */}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwnMessage
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
          }`}
        >
          <p className="text-sm leading-relaxed break-words">
            {message.content}
          </p>
          
          {/* Время и статус */}
          <div className={`flex items-center justify-end mt-1 space-x-1 ${
            isOwnMessage ? 'text-blue-100' : 'text-gray-500'
          }`}>
            <span className="text-xs">
              {formatTime(message.createdAt)}
            </span>
            {isOwnMessage && getMessageStatus()}
          </div>
        </div>
      </div>

      {/* Аватар для своих сообщений */}
      {isOwnMessage && (
        <div className="flex items-end mb-1 order-1">
          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold ml-2">
            {message.sender.profile.name?.charAt(0) || '?'}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MessageBubble; 