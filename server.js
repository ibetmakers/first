const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('client/public'));

// MongoDB подключение
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 секунд таймаут
    socketTimeoutMS: 45000, // 45 секунд таймаут сокета
    connectTimeoutMS: 30000, // 30 секунд таймаут подключения
    maxPoolSize: 10, // максимальный размер пула соединений
    minPoolSize: 1, // минимальный размер пула соединений
    maxIdleTimeMS: 30000, // максимальное время простоя соединения
    retryWrites: true,
    w: 'majority'
})
.then(() => console.log('✅ Подключение к MongoDB успешно'))
.catch(err => {
    console.error('❌ Ошибка подключения к MongoDB:', err);
    console.error('🔍 Детали ошибки:', {
        code: err.code,
        message: err.message,
        name: err.name
    });
    
    // Дополнительная диагностика
    if (err.code === 'ETIMEOUT') {
        console.error('⚠️  Проблема с DNS или сетевым подключением');
        console.error('💡 Попробуйте:');
        console.error('   1. Проверить интернет-соединение');
        console.error('   2. Использовать VPN');
        console.error('   3. Изменить DNS-серверы на 8.8.8.8 и 8.8.4.4');
        console.error('   4. Проверить настройки файрвола');
    }
});

// Схема пользователя
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const User = mongoose.model('User', userSchema);

// Middleware для проверки JWT токена
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Токен доступа не предоставлен' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Недействительный токен' });
        }
        req.user = user;
        next();
    });
};

// Валидация для регистрации
const registerValidation = [
    body('username').isLength({ min: 3, max: 30 }).withMessage('Имя пользователя должно быть от 3 до 30 символов'),
    body('email').isEmail().withMessage('Введите корректный email'),
    body('password').isLength({ min: 6 }).withMessage('Пароль должен быть не менее 6 символов'),
    body('firstName').notEmpty().withMessage('Имя обязательно'),
    body('lastName').notEmpty().withMessage('Фамилия обязательна')
];

// Валидация для входа
const loginValidation = [
    body('email').isEmail().withMessage('Введите корректный email'),
    body('password').notEmpty().withMessage('Пароль обязателен')
];

// Маршруты API

// Регистрация пользователя
app.post('/api/register', registerValidation, async (req, res) => {
    try {
        // Проверка ошибок валидации
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Ошибки валидации',
                errors: errors.array() 
            });
        }

        const { username, email, password, firstName, lastName } = req.body;

        // Проверка существования пользователя
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: 'Пользователь с таким email или именем уже существует' 
            });
        }

        // Хеширование пароля
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Создание нового пользователя
        const user = new User({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName
        });

        await user.save();

        // Создание JWT токена
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Пользователь успешно зарегистрирован',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

// Вход пользователя
app.post('/api/login', loginValidation, async (req, res) => {
    try {
        // Проверка ошибок валидации
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                message: 'Ошибки валидации',
                errors: errors.array() 
            });
        }

        const { email, password } = req.body;

        // Поиск пользователя
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        // Проверка пароля
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        // Создание JWT токена
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Вход выполнен успешно',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

// Получение профиля пользователя
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        res.json(user);
    } catch (error) {
        console.error('Ошибка получения профиля:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

// Обновление профиля пользователя
app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
        const { firstName, lastName } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { firstName, lastName },
            { new: true }
        ).select('-password');

        res.json({
            message: 'Профиль обновлен',
            user
        });
    } catch (error) {
        console.error('Ошибка обновления профиля:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

// Проверка статуса сервера
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Сервер работает',
        timestamp: new Date().toISOString()
    });
});

// Отдаем React приложение для всех остальных маршрутов
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'public', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📱 API доступен по адресу: http://localhost:${PORT}/api`);
    console.log(`🌐 Frontend доступен по адресу: http://localhost:${PORT}`);
}); 