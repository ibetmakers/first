const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://doublebrown:Nicex10@cluster0.nwcpxml.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Импорт моделей
const User = require('../models/User');
const Service = require('../models/Service');

// Функция для создания хеша пароля
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

// Демо пользователи
const demoUsers = [
  {
    username: 'demo_user',
    email: 'user@demo.com',
    password: 'password123',
    role: 'user',
    profile: {
      name: 'Демо Пользователь',
      bio: 'Обычный пользователь для тестирования',
      phone: '+7 (999) 123-45-67',
      website: 'https://example.com',
      location: 'Москва, Россия'
    },
    isVerified: true,
    isActive: true
  },
  {
    username: 'demo_service',
    email: 'service@demo.com',
    password: 'password123',
    role: 'service',
    profile: {
      name: 'Демо Сервис',
      bio: 'Тестовый сервис для демонстрации возможностей',
      phone: '+7 (999) 987-65-43',
      website: 'https://demo-service.com',
      location: 'Санкт-Петербург, Россия'
    },
    isVerified: true,
    isActive: true
  },
  {
    username: 'demo_admin',
    email: 'admin@demo.com',
    password: 'password123',
    role: 'admin',
    profile: {
      name: 'Администратор',
      bio: 'Главный администратор системы',
      phone: '+7 (999) 555-55-55',
      website: 'https://admin.com',
      location: 'Москва, Россия'
    },
    isVerified: true,
    isActive: true
  }
];

// Демо сервисы
const demoServices = [
  {
    name: 'Telegram Bot Assistant',
    description: 'Умный Telegram бот для автоматизации задач. Помогает управлять задачами, напоминаниями и организацией времени. Поддерживает интеграцию с календарем и другими сервисами.',
    shortDescription: 'Умный помощник для Telegram с функциями автоматизации',
    category: 'bot',
    contact: {
      website: 'https://tgbot-assistant.com',
      telegram: 'tgbot_assistant',
      email: 'support@tgbot-assistant.com',
      phone: '+7 (999) 111-11-11'
    },
    features: [
      {
        title: 'Автоматизация задач',
        description: 'Создание и управление задачами через бота',
        icon: '✅'
      },
      {
        title: 'Напоминания',
        description: 'Умная система напоминаний и уведомлений',
        icon: '⏰'
      },
      {
        title: 'Интеграции',
        description: 'Подключение к календарю и другим сервисам',
        icon: '🔗'
      }
    ],
    pricing: 'Бесплатно',
    tags: ['telegram', 'бот', 'автоматизация', 'задачи'],
    status: 'active',
    isPremium: true,
    views: 1250,
    clicks: 89,
    rating: {
      average: 4.8,
      count: 156
    },
    position: 1
  },
  {
    name: 'Web Analytics Pro',
    description: 'Профессиональная система аналитики для веб-сайтов. Предоставляет детальную статистику посещений, поведения пользователей и конверсий. Включает A/B тестирование и тепловые карты.',
    shortDescription: 'Профессиональная аналитика для веб-сайтов',
    category: 'website',
    contact: {
      website: 'https://web-analytics-pro.com',
      telegram: 'web_analytics_pro',
      email: 'info@web-analytics-pro.com',
      phone: '+7 (999) 222-22-22'
    },
    features: [
      {
        title: 'Детальная аналитика',
        description: 'Подробная статистика посещений и поведения',
        icon: '📊'
      },
      {
        title: 'A/B тестирование',
        description: 'Тестирование различных версий страниц',
        icon: '🧪'
      },
      {
        title: 'Тепловые карты',
        description: 'Визуализация поведения пользователей',
        icon: '🔥'
      }
    ],
    pricing: 'От $29/месяц',
    tags: ['аналитика', 'веб-сайт', 'статистика', 'конверсия'],
    status: 'active',
    isPremium: false,
    views: 890,
    clicks: 67,
    rating: {
      average: 4.6,
      count: 89
    },
    position: 2
  },
  {
    name: 'Mobile App Builder',
    description: 'Конструктор мобильных приложений без кода. Позволяет создавать профессиональные приложения для iOS и Android с помощью drag-and-drop интерфейса. Включает готовые шаблоны и интеграции.',
    shortDescription: 'Создание мобильных приложений без программирования',
    category: 'app',
    contact: {
      website: 'https://mobile-app-builder.com',
      telegram: 'mobile_app_builder',
      email: 'hello@mobile-app-builder.com',
      phone: '+7 (999) 333-33-33'
    },
    features: [
      {
        title: 'Drag & Drop',
        description: 'Создание приложений без знания кода',
        icon: '🎯'
      },
      {
        title: 'Готовые шаблоны',
        description: 'Большая библиотека готовых шаблонов',
        icon: '📱'
      },
      {
        title: 'Кроссплатформенность',
        description: 'Поддержка iOS и Android',
        icon: '🔄'
      }
    ],
    pricing: 'От $99/месяц',
    tags: ['мобильное приложение', 'конструктор', 'без кода', 'шаблоны'],
    status: 'active',
    isPremium: true,
    views: 2100,
    clicks: 145,
    rating: {
      average: 4.9,
      count: 234
    },
    position: 3
  },
  {
    name: 'Cloud Storage Manager',
    description: 'Универсальный менеджер облачных хранилищ. Объединяет доступ к Dropbox, Google Drive, OneDrive и другим сервисам в едином интерфейсе. Включает синхронизацию и резервное копирование.',
    shortDescription: 'Управление всеми облачными хранилищами в одном месте',
    category: 'service',
    contact: {
      website: 'https://cloud-storage-manager.com',
      telegram: 'cloud_storage_manager',
      email: 'support@cloud-storage-manager.com',
      phone: '+7 (999) 444-44-44'
    },
    features: [
      {
        title: 'Единый доступ',
        description: 'Работа с разными облачными сервисами',
        icon: '☁️'
      },
      {
        title: 'Синхронизация',
        description: 'Автоматическая синхронизация файлов',
        icon: '🔄'
      },
      {
        title: 'Резервное копирование',
        description: 'Надежное резервное копирование данных',
        icon: '💾'
      }
    ],
    pricing: 'Бесплатно',
    tags: ['облачное хранилище', 'синхронизация', 'резервное копирование', 'файлы'],
    status: 'active',
    isPremium: false,
    views: 567,
    clicks: 34,
    rating: {
      average: 4.4,
      count: 67
    },
    position: 4
  }
];

// Основная функция инициализации
const initDatabase = async () => {
  try {
    console.log('🚀 Начинаем инициализацию базы данных...');

    // Очистка существующих данных
    await User.deleteMany({});
    await Service.deleteMany({});
    console.log('✅ Существующие данные очищены');

    // Создание пользователей
    const createdUsers = [];
    for (const userData of demoUsers) {
      const hashedPassword = await hashPassword(userData.password);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Пользователь создан: ${userData.email}`);
    }

    // Создание сервисов
    const serviceOwner = createdUsers.find(u => u.role === 'service');
    for (const serviceData of demoServices) {
      const service = new Service({
        ...serviceData,
        owner: serviceOwner._id
      });
      await service.save();
      console.log(`✅ Сервис создан: ${serviceData.name}`);
    }

    console.log('\n🎉 База данных успешно инициализирована!');
    console.log('\n📋 Демо аккаунты:');
    demoUsers.forEach(user => {
      console.log(`   ${user.email} / ${user.password} (${user.role})`);
    });
    console.log('\n🔗 Сервер будет доступен по адресу: http://localhost:5000');
    console.log('🔗 Клиент будет доступен по адресу: http://localhost:3000');

  } catch (error) {
    console.error('❌ Ошибка инициализации базы данных:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n👋 Соединение с базой данных закрыто');
  }
};

// Запуск инициализации
initDatabase(); 