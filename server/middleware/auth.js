const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Аккаунт заблокирован' });
    }

    req.user = decoded;
    req.userData = user;
    next();
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(401).json({ message: 'Недействительный токен' });
  }
};



module.exports = auth;