import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useMessengerStore } from '../../stores/messengerStore';
import { useAuthStore } from '../../stores/authStore';

interface StartChatButtonProps {
  serviceId: string;
  serviceName: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

const StartChatButton: React.FC<StartChatButtonProps> = ({ 
  serviceId, 
  serviceName, 
  className = '',
  variant = 'primary'
}) => {
  const { startChatWithService, openMessenger, isLoading } = useMessengerStore();
  const { isAuthenticated } = useAuthStore();

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      // Перенаправить на страницу входа
      window.location.href = '/login';
      return;
    }

    try {
      await startChatWithService(serviceId);
      openMessenger();
    } catch (error) {
      console.error('Ошибка при создании чата:', error);
    }
  };

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`;
      case 'secondary':
        return `${baseClasses} bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500`;
      case 'outline':
        return `${baseClasses} border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500`;
      default:
        return baseClasses;
    }
  };

  return (
    <motion.button
      onClick={handleStartChat}
      disabled={isLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${getButtonClasses()} ${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      ) : (
        <MessageCircle className="w-4 h-4" />
      )}
      <span>
        {isLoading ? 'Создание чата...' : `Начать чат с ${serviceName}`}
      </span>
    </motion.button>
  );
};

export default StartChatButton; 