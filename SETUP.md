# 🚀 Инструкция по запуску ServiceHub

## Быстрый старт

### 1. Установка зависимостей
```bash
npm run install-all
```

### 2. Настройка базы данных
Создайте файл `.env` в папке `server`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/service-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Запуск MongoDB
```bash
# Локально
mongod

# Или используйте MongoDB Atlas (облачная версия)
```

### 4. Инициализация базы данных
```bash
cd server
npm run init-db
```

### 5. Запуск приложения
```bash
# В корневой папке проекта
npm run dev
```

## 📋 Демо аккаунты

После инициализации базы данных будут созданы следующие аккаунты:

| Роль | Email | Пароль | Описание |
|------|-------|--------|----------|
| Пользователь | user@demo.com | password123 | Обычный пользователь |
| Сервис | service@demo.com | password123 | Владелец сервисов |
| Админ | admin@demo.com | password123 | Администратор |

## 🌐 Доступ к приложению

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🛠 Структура проекта

```
service-advertising-platform/
├── server/                 # Backend (Node.js + Express)
│   ├── models/            # MongoDB модели
│   ├── routes/            # API маршруты
│   ├── middleware/        # Middleware
│   ├── scripts/           # Скрипты
│   └── index.js           # Основной файл сервера
├── client/                # Frontend (React + TypeScript)
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

## 🔧 Основные команды

### Установка
```bash
# Установка всех зависимостей
npm run install-all

# Установка по отдельности
npm install
cd server && npm install
cd ../client && npm install
```

### Разработка
```bash
# Запуск в режиме разработки (backend + frontend)
npm run dev

# Запуск только backend
npm run server

# Запуск только frontend
npm run client
```

### База данных
```bash
# Инициализация с демо-данными
cd server && npm run init-db

# Очистка базы данных
cd server && npm run init-db
```

### Сборка
```bash
# Сборка frontend для продакшена
npm run build
```

## 🎯 Возможности

### Для пользователей
- ✅ Просмотр сервисов
- ✅ Поиск и фильтрация
- ✅ Регистрация и авторизация
- ✅ Просмотр детальной информации о сервисах

### Для сервисов
- ✅ Регистрация как сервис
- ✅ Панель управления
- ✅ Статистика просмотров и кликов
- ✅ Управление профилем

### Для администраторов
- ✅ Управление пользователями
- ✅ Модерация сервисов
- ✅ Системная статистика

## 🐛 Решение проблем

### Ошибка подключения к MongoDB
```bash
# Проверьте, что MongoDB запущен
mongod

# Или используйте MongoDB Atlas
# Обновите MONGODB_URI в .env файле
```

### Ошибка портов
```bash
# Если порт 3000 занят
# Измените в client/package.json
"scripts": {
  "start": "PORT=3001 react-scripts start"
}

# Если порт 5000 занят
# Измените в server/.env
PORT=5001
```

### Ошибки зависимостей
```bash
# Очистите кэш npm
npm cache clean --force

# Удалите node_modules и переустановите
rm -rf node_modules package-lock.json
npm install
```

## 📱 Адаптивность

Приложение полностью адаптивно и работает на:
- 📱 Мобильные устройства
- 💻 Планшеты
- 🖥️ Десктопы

## 🎨 Дизайн

- **Современный UI/UX** с анимациями
- **Glass morphism** эффекты
- **Gradient backgrounds**
- **Responsive design**
- **Dark/light theme** готовность

## 🔒 Безопасность

- **JWT авторизация**
- **Хеширование паролей**
- **Валидация данных**
- **Rate limiting**
- **CORS настройки**

## 🚀 Развертывание

### Heroku
```bash
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

## 📞 Поддержка

Если у вас возникли проблемы:

1. Проверьте консоль браузера (F12)
2. Проверьте логи сервера
3. Убедитесь, что MongoDB запущен
4. Проверьте переменные окружения

## 🎉 Готово!

После выполнения всех шагов у вас будет работающее приложение с:
- ✅ Современным дизайном
- ✅ Полной функциональностью
- ✅ Демо-данными
- ✅ Готовностью к продакшену

Приятного использования! 🚀 