# ServiceHub - Платформа рекламы сервисов

Ультра-современный веб-сервис для размещения рекламы сервисов, ботов и веб-сайтов.

## 🚀 Возможности

- **Современный адаптивный дизайн** - Красивые карточки сервисов с анимациями
- **Система авторизации** - Регистрация и вход для пользователей и сервисов
- **Админ-панель** - Управление сервисами и пользователями
- **Поиск и фильтрация** - Поиск по названию, фильтрация по категориям
- **Статистика** - Просмотры, клики, рейтинги
- **Premium размещение** - Возможность выделить свой сервис

## 🛠 Технологии

### Backend
- **Node.js** + **Express.js** - Серверная часть
- **MongoDB** + **Mongoose** - База данных
- **JWT** - Авторизация
- **bcryptjs** - Хеширование паролей
- **express-validator** - Валидация данных

### Frontend
- **React** + **TypeScript** - Клиентская часть
- **Tailwind CSS** - Стилизация
- **Framer Motion** - Анимации
- **React Query** - Управление состоянием
- **Zustand** - Глобальное состояние
- **React Hook Form** - Формы

## 📦 Установка

### Предварительные требования
- Node.js (версия 16 или выше)
- MongoDB (локально или MongoDB Atlas)
- npm или yarn

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd service-advertising-platform
```

### 2. Установка зависимостей
```bash
# Установка всех зависимостей
npm run install-all

# Или по отдельности:
npm install
cd server && npm install
cd ../client && npm install
```

### 3. Настройка переменных окружения

Создайте файл `.env` в папке `server`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/service-platform
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:3000
```

### 4. Запуск MongoDB
```bash
# Локально
mongod

# Или используйте MongoDB Atlas
```

### 5. Запуск приложения

#### Режим разработки (одновременно backend и frontend)
```bash
npm run dev
```

#### Запуск по отдельности
```bash
# Backend
npm run server

# Frontend (в другом терминале)
npm run client
```

Приложение будет доступно по адресам:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🎯 Демо аккаунты

Для тестирования доступны следующие аккаунты:

| Роль | Email | Пароль |
|------|-------|--------|
| Пользователь | user@demo.com | password123 |
| Сервис | service@demo.com | password123 |
| Админ | admin@demo.com | password123 |

## 📁 Структура проекта

```
service-advertising-platform/
├── server/                 # Backend
│   ├── models/            # MongoDB модели
│   ├── routes/            # API маршруты
│   ├── middleware/        # Middleware
│   └── index.js           # Основной файл сервера
├── client/                # Frontend
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── pages/         # Страницы
│   │   ├── api/           # API функции
│   │   ├── stores/        # Zustand stores
│   │   └── App.tsx        # Основной компонент
│   └── package.json
├── package.json           # Корневой package.json
└── README.md
```

## 🔧 API Endpoints

### Авторизация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Получение профиля
- `PUT /api/auth/profile` - Обновление профиля

### Сервисы
- `GET /api/services` - Получение всех сервисов
- `GET /api/services/:id` - Получение сервиса по ID
- `POST /api/services` - Создание сервиса
- `PUT /api/services/:id` - Обновление сервиса
- `DELETE /api/services/:id` - Удаление сервиса

### Пользователи
- `GET /api/users` - Получение всех пользователей (админ)
- `GET /api/users/:id` - Получение профиля пользователя

## 🎨 Особенности дизайна

- **Адаптивный дизайн** - Работает на всех устройствах
- **Современные анимации** - Плавные переходы и эффекты
- **Темная/светлая тема** - Автоматическое переключение
- **Glass morphism** - Современные эффекты размытия
- **Gradient backgrounds** - Красивые градиенты

## 🚀 Развертывание

### Heroku
```bash
# Установка Heroku CLI
heroku create your-app-name
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
git push heroku main
```

### Vercel (Frontend)
```bash
npm install -g vercel
vercel
```

### Railway
```bash
# Подключите репозиторий к Railway
# Настройте переменные окружения в панели управления
```

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 📞 Поддержка

Если у вас есть вопросы или проблемы, создайте issue в репозитории или свяжитесь с нами:

- Email: support@servicehub.com
- Telegram: @servicehub_support

## 🎉 Благодарности

Спасибо всем, кто внес вклад в развитие этого проекта! 