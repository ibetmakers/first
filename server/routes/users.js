const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

const router = express.Router();

// Получение профиля пользователя (публичный доступ)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('profile role isVerified createdAt');
    
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение всех пользователей (только админ)
router.get('/', auth, requireRole(['admin']), async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (role) {
      query.role = role;
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Ошибка получения пользователей:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Блокировка/разблокировка пользователя (только админ)
router.put('/:id/status', auth, requireRole(['admin']), async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      message: `Пользователь ${isActive ? 'разблокирован' : 'заблокирован'}`,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Ошибка изменения статуса пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Изменение роли пользователя (только админ)
router.put('/:id/role', auth, requireRole(['admin']), async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'service', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Неверная роль' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.role = role;
    await user.save();

    res.json({
      message: 'Роль пользователя изменена',
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Ошибка изменения роли:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удаление пользователя (только админ)
router.delete('/:id', auth, requireRole(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    await user.remove();

    res.json({ message: 'Пользователь удален' });
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router; 