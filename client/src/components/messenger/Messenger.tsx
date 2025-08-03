import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, ChevronLeft, MoreVertical } from 'lucide-react';
import { useMessengerStore } from '../../stores/messengerStore';
import { useAuthStore } from '../../stores/authStore';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const Messenger: React.FC = () => {
  const { isOpen, closeMessenger, unreadCount, updateUnreadCount } = useMessengerStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      updateUnreadCount();
    }
  }, [isOpen, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Кнопка мессенджера в навигации */}
      <MessengerButton />
      
      {/* Окно мессенджера */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeMessenger();
              }
            }}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] max-h-[600px] flex overflow-hidden">
              {/* Левая панель с чатами */}
              <div className="w-1/3 border-r border-gray-200 bg-gray-50">
                <ChatList />
              </div>
              
              {/* Правая панель с сообщениями */}
              <div className="w-2/3 bg-white">
                <ChatWindow />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Компонент кнопки мессенджера
const MessengerButton: React.FC = () => {
  const { openMessenger, unreadCount } = useMessengerStore();

  return (
    <button
      onClick={openMessenger}
      className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
    >
      <MessageCircle className="w-6 h-6" />
      {unreadCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </motion.div>
      )}
    </button>
  );
};

export default Messenger; 