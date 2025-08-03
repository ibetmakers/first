import React from 'react';

interface SimpleStartChatButtonProps {
  serviceId: string;
  serviceName: string;
  className?: string;
}

const SimpleStartChatButton: React.FC<SimpleStartChatButtonProps> = ({ 
  serviceId, 
  serviceName, 
  className = ''
}) => {
  return (
    <button className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 ${className}`}>
      <span>💬</span>
      <span>Начать чат с {serviceName}</span>
    </button>
  );
};

export default SimpleStartChatButton; 