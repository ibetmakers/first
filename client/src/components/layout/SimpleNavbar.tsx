import React from 'react';
import { Link } from 'react-router-dom';

const SimpleNavbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Сервисы
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-700 hover:text-gray-900">
              Войти
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-gray-900">
              Регистрация
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SimpleNavbar; 