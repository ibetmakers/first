import React from 'react';

const SimpleMessenger: React.FC = () => {
  return (
    <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
      <span className="w-6 h-6">💬</span>
    </button>
  );
};

export default SimpleMessenger; 