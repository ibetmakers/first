import React from 'react';

const SimpleNavbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900">
              Сервисы
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
              Войти
            </span>
            <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Регистрация
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SimpleNavbar; 