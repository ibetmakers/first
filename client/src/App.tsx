import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// Данные сервисов
const allServices = [
  {
    id: 1,
    name: "Веб-разработка",
    description: "Создание современных веб-сайтов и веб-приложений",
    price: "от 50,000 ₽",
    rating: 4.8,
    avatar: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150&h=150&fit=crop&crop=face",
    location: "Москва",
    fullDescription: "Профессиональная разработка веб-сайтов и веб-приложений с использованием современных технологий. Мы создаем адаптивные, быстрые и SEO-оптимизированные решения для вашего бизнеса.",
    features: ["Адаптивный дизайн", "SEO-оптимизация", "Интеграция с CMS", "Техническая поддержка"],
    experience: "5+ лет",
    projects: "150+ проектов"
  },
  {
    id: 2,
    name: "Мобильная разработка",
    description: "Разработка iOS и Android приложений",
    price: "от 80,000 ₽",
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=150&h=150&fit=crop&crop=face",
    location: "Санкт-Петербург",
    fullDescription: "Создание нативных и кроссплатформенных мобильных приложений для iOS и Android. От концепции до публикации в App Store и Google Play.",
    features: ["Нативная разработка", "Кроссплатформенные решения", "UI/UX дизайн", "Тестирование"],
    experience: "4+ года",
    projects: "80+ приложений"
  },
  {
    id: 3,
    name: "UI/UX Дизайн",
    description: "Создание интуитивных интерфейсов",
    price: "от 30,000 ₽",
    rating: 4.7,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    location: "Москва",
    fullDescription: "Проектирование пользовательских интерфейсов и пользовательского опыта. Создание красивых и функциональных дизайнов.",
    features: ["Прототипирование", "Визуальный дизайн", "Пользовательские тесты", "Дизайн-системы"],
    experience: "6+ лет",
    projects: "200+ проектов"
  },
  {
    id: 4,
    name: "SEO-оптимизация",
    description: "Продвижение сайтов в поисковых системах",
    price: "от 25,000 ₽",
    rating: 4.6,
    avatar: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=150&h=150&fit=crop&crop=face",
    location: "Казань",
    fullDescription: "Комплексная SEO-оптимизация сайтов для повышения позиций в поисковых системах и увеличения органического трафика.",
    features: ["Аудит сайта", "Техническая оптимизация", "Контент-маркетинг", "Аналитика"],
    experience: "7+ лет",
    projects: "300+ сайтов"
  },
  {
    id: 5,
    name: "Копирайтинг",
    description: "Создание продающих текстов и контента",
    price: "от 15,000 ₽",
    rating: 4.8,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    location: "Екатеринбург",
    fullDescription: "Написание качественных текстов для сайтов, рекламных материалов и контент-маркетинга. Продающие тексты, которые конвертируют.",
    features: ["Продающие тексты", "SEO-копирайтинг", "Контент-план", "Редактирование"],
    experience: "3+ года",
    projects: "500+ текстов"
  },
  {
    id: 6,
    name: "SMM-продвижение",
    description: "Продвижение в социальных сетях",
    price: "от 20,000 ₽",
    rating: 4.5,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    location: "Новосибирск",
    fullDescription: "Комплексное продвижение брендов в социальных сетях. Создание контента, управление сообществами и рекламные кампании.",
    features: ["Контент-план", "Ведение соцсетей", "Рекламные кампании", "Аналитика"],
    experience: "4+ года",
    projects: "100+ проектов"
  }
];

// Компонент карточки сервиса
const ServiceCard = ({ service }: { service: any }) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
    <div className="p-6">
      <div className="flex items-center mb-4">
        <img 
          src={service.avatar} 
          alt={service.name}
          className="w-12 h-12 rounded-full object-cover mr-4"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
          }}
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
          <p className="text-sm text-gray-500">{service.location}</p>
        </div>
      </div>
      <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-bold text-gray-900">{service.price}</span>
        <div className="flex items-center">
          <span className="text-yellow-400">★</span>
          <span className="text-sm text-gray-600 ml-1">{service.rating}</span>
        </div>
      </div>
      <a 
        href={`/service/${service.id}`}
        className="block w-full bg-gray-900 text-white text-center py-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
      >
        Подробнее
      </a>
    </div>
  </div>
);

// Компонент слайдера
const HeroSlider = () => (
  <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
    <div className="relative">
      <img 
        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=400&fit=crop"
        alt="ServiceHub"
        className="w-full h-64 object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Найдите лучшие сервисы</h1>
          <p className="text-xl mb-6">Профессионалы для вашего бизнеса</p>
          <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
            Начать поиск
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Компонент навигации
const Navbar = () => {
  const [btcPrice, setBtcPrice] = useState<string>('Загрузка...');
  const [selectedCity, setSelectedCity] = useState<string>('Все города');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const cities = ['Все города', 'Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург', 'Новосибирск'];

  useEffect(() => {
    // Получение курса Bitcoin
    const fetchBtcPrice = async () => {
      try {
        const btcResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const btcData = await btcResponse.json();
        const btcUsd = btcData.bitcoin.usd;
        
        const usdResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const usdData = await usdResponse.json();
        const usdToRub = usdData.rates.RUB;
        
        const btcRub = (btcUsd * usdToRub).toLocaleString('ru-RU', { maximumFractionDigits: 0 });
        setBtcPrice(`${btcRub} ₽`);
      } catch (error) {
        setBtcPrice('Ошибка загрузки');
      }
    };

    fetchBtcPrice();
    const interval = setInterval(fetchBtcPrice, 60000); // Обновляем каждую минуту

    // Проверяем аутентификацию
    const userData = localStorage.getItem('user');
    if (userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setIsUserDropdownOpen(false);
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900">ServiceHub</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Выбор города */}
            <div className="relative">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center text-sm text-gray-700 hover:text-gray-900"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {selectedCity}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isCityDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder="Поиск города..."
                      value={citySearchQuery}
                      onChange={(e) => setCitySearchQuery(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {cities
                      .filter(city => city.toLowerCase().includes(citySearchQuery.toLowerCase()))
                      .map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setSelectedCity(city);
                            setIsCityDropdownOpen(false);
                            setCitySearchQuery('');
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {city}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Курс Bitcoin */}
            <div className="flex items-center text-sm text-gray-700">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              {btcPrice}
            </div>

            {/* Пользователь или кнопки входа */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  <img 
                    src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{user?.username || 'Пользователь'}</span>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    <span className="text-xs">{user?.balance || '0.00'} BTC</span>
                  </div>
                </button>
                
                {isUserDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Профиль</a>
                    <a href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Панель управления</a>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a href="/login" className="text-gray-700 hover:text-gray-900 text-sm">Войти</a>
                <a href="/register" className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm">Регистрация</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Компонент главной страницы
const HomePage = () => {
  const [filteredServices, setFilteredServices] = useState(allServices);

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroSlider />
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Наши сервисы</h2>
          <p className="text-gray-600">Выберите профессиональную услугу для вашего бизнеса</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Компонент страницы сервиса
const ServiceDetailPage = () => {
  const navigate = useNavigate();
  const serviceId = parseInt(window.location.pathname.split('/').pop() || '1');
  const service = allServices.find(s => s.id === serviceId);

  if (!service) {
    return (
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Сервис не найден</h1>
          <button 
            onClick={() => navigate('/')}
            className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <img 
                src={service.avatar} 
                alt={service.name}
                className="w-16 h-16 rounded-full object-cover mr-6"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
                }}
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
                <p className="text-gray-600">{service.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Описание</h2>
                <p className="text-gray-600 mb-6">{service.fullDescription}</p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Особенности</h3>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Опыт:</span>
                      <span className="font-semibold">{service.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Проектов:</span>
                      <span className="font-semibold">{service.projects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Рейтинг:</span>
                      <span className="font-semibold">{service.rating} ★</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Стоимость:</span>
                      <span className="font-semibold text-green-600">{service.price}</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gray-900 text-white py-3 rounded-lg mt-6 hover:bg-gray-800 transition-colors duration-200">
                    Связаться с исполнителем
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Отзывы</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="ml-2 text-sm text-gray-600">Отличная работа!</span>
                  </div>
                  <p className="text-gray-600 text-sm">Очень доволен качеством работы. Рекомендую!</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="ml-2 text-sm text-gray-600">Профессионал</span>
                  </div>
                  <p className="text-gray-600 text-sm">Быстро и качественно выполнил заказ.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Компоненты страниц
const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Имитация входа
    const userData = {
      username: 'Пользователь',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      balance: '0.005'
    };
    localStorage.setItem('user', JSON.stringify(userData));
    window.location.reload();
  };

  return (
    <div className="pt-16">
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Вход</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Введите email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Пароль</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Введите пароль"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition-colors duration-200"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Имитация регистрации
    const userData = {
      username: formData.name,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      balance: '0.001'
    };
    localStorage.setItem('user', JSON.stringify(userData));
    window.location.reload();
  };

  return (
    <div className="pt-16">
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Имя</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Введите имя"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Введите email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Пароль</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Введите пароль"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition-colors duration-200"
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
};

const DashboardPage = () => (
  <div className="pt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Панель управления</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Мои заказы</h3>
          <p className="text-gray-600">У вас пока нет заказов</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Баланс</h3>
          <p className="text-2xl font-bold text-green-600">0.005 BTC</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Настройки</h3>
          <p className="text-gray-600">Управление профилем</p>
        </div>
      </div>
    </div>
  </div>
);

const ProfilePage = () => (
  <div className="pt-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Профиль</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
          <div>
            <h2 className="text-xl font-semibold">Пользователь</h2>
            <p className="text-gray-600">user@example.com</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Имя</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded" defaultValue="Пользователь" />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input type="email" className="w-full p-2 border border-gray-300 rounded" defaultValue="user@example.com" />
          </div>
          <button className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors duration-200">
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Обертка для навигации
const NavbarWrapper = () => {
  const navigate = useNavigate();
  return <Navbar />;
};

// Главный компонент приложения
const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavbarWrapper />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/service/:id" element={<ServiceDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 