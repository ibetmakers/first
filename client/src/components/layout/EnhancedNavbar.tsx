import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EnhancedMessenger from '../messenger/EnhancedMessenger';
import { useMessengerStore } from '../../stores/messengerStore';

interface City {
  id: string;
  name: string;
  code: string;
}

interface BitcoinPrice {
  usd: number;
  change24h: number;
}

const EnhancedNavbar: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<City>({ id: '1', name: 'Москва', code: 'MSK' });
  const [bitcoinPrice, setBitcoinPrice] = useState<BitcoinPrice>({ usd: 43250, change24h: 2.5 });
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isOpen: isMessengerOpen, openMessenger, closeMessenger } = useMessengerStore();

  // Проверяем, авторизован ли пользователь
  const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    return user !== null;
  };

  const getUserData = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const userData = getUserData();

  // Список городов
  const cities: City[] = [
    { id: '1', name: 'Москва', code: 'MSK' },
    { id: '2', name: 'Санкт-Петербург', code: 'SPB' },
    { id: '3', name: 'Новосибирск', code: 'NSK' },
    { id: '4', name: 'Екатеринбург', code: 'EKB' },
    { id: '5', name: 'Казань', code: 'KZN' },
    { id: '6', name: 'Нижний Новгород', code: 'NN' },
    { id: '7', name: 'Челябинск', code: 'CHL' },
    { id: '8', name: 'Самара', code: 'SMR' },
  ];

  // Имитация обновления курса биткоина
  useEffect(() => {
    const interval = setInterval(() => {
      setBitcoinPrice(prev => ({
        usd: prev.usd + (Math.random() - 0.5) * 100,
        change24h: prev.change24h + (Math.random() - 0.5) * 0.5
      }));
    }, 30000); // Обновляем каждые 30 секунд

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Левая часть - Логотип и выбор города */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
              Сервисы
            </Link>
            
            {/* Выбор города */}
            <div className="relative">
              <button
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium">{selectedCity.name}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Выпадающий список городов */}
              {showCityDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder="Поиск города..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {cities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => {
                          setSelectedCity(city);
                          setShowCityDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                          selectedCity.id === city.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{city.name}</span>
                          <span className="text-xs text-gray-500">{city.code}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Центральная часть - Курс биткоина */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div className="text-sm">
                <div className="font-semibold">BTC ${bitcoinPrice.usd.toLocaleString()}</div>
                <div className={`text-xs ${bitcoinPrice.change24h >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                  {bitcoinPrice.change24h >= 0 ? '+' : ''}{bitcoinPrice.change24h.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* Правая часть - Пользователь и мессенджер */}
          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <>
                {/* Иконка мессенджера с счетчиком */}
                <div className="relative">
                  <button 
                    onClick={() => openMessenger()}
                    className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {/* Счетчик новых сообщений */}
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      3
                    </span>
                  </button>
                </div>

                {/* Меню пользователя */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {userData?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {userData?.username || 'Пользователь'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Баланс: {userData?.balance || '0.025'} BTC
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Выпадающее меню пользователя */}
                  {showUserMenu && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {userData?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {userData?.username || 'Пользователь'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {userData?.email || 'user@example.com'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                          </svg>
                          <span>Личный кабинет</span>
                        </Link>
                        
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Профиль</span>
                        </Link>
                        
                        <div className="border-t border-gray-200 my-2"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Выйти</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Войти
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Регистрация
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Оверлей для закрытия выпадающих меню */}
      {(showCityDropdown || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowCityDropdown(false);
            setShowUserMenu(false);
          }}
        />
      )}

      {/* Enhanced Messenger */}
      <EnhancedMessenger />
    </nav>
  );
};

export default EnhancedNavbar; 