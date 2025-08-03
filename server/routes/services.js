const express = require('express');
const { body, validationResult } = require('express-validator');
const Service = require('../models/Service');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

const router = express.Router();

// Получение всех активных сервисов (публичный доступ)
router.get('/', async (req, res) => {
  try {
    const { category, search, sort = 'position' } = req.query;
    
    let query = { status: 'active' };
    
    // Фильтрация по категории
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Поиск по тексту
    if (search) {
      query.$text = { $search: search };
    }
    
    // Сортировка
    let sortOptions = {};
    switch (sort) {
      case 'rating':
        sortOptions = { 'rating.average': -1, 'rating.count': -1 };
        break;
      case 'views':
        sortOptions = { views: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { isPremium: -1, position: 1, createdAt: -1 };
    }
    
    const services = await Service.find(query)
      .populate('owner', 'profile.name profile.avatar')
      .sort(sortOptions)
      .limit(50);
    
    res.json({ services });
  } catch (error) {
    console.error('Ошибка получения сервисов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение сервиса по ID (публичный доступ)
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('owner', 'profile.name profile.avatar profile.bio');
    
    if (!service) {
      return res.status(404).json({ message: 'Сервис не найден' });
    }
    
    // Увеличение просмотров
    await service.incrementViews();
    
    res.json({ service });
  } catch (error) {
    console.error('Ошибка получения сервиса:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создание нового сервиса (только для сервисов и админов)
router.post('/', auth, requireRole(['service', 'admin']), [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('description').trim().isLength({ min: 10, max: 1000 }),
  body('shortDescription').trim().isLength({ min: 5, max: 200 }),
  body('category').isIn(['bot', 'website', 'app', 'service', 'other']),
  body('pricing').optional().trim(),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const serviceData = {
      ...req.body,
      owner: req.user.userId
    };

    const service = new Service(serviceData);
    await service.save();

    res.status(201).json({
      message: 'Сервис успешно создан',
      service
    });
  } catch (error) {
    console.error('Ошибка создания сервиса:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновление сервиса (владелец или админ)
router.put('/:id', auth, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }),
  body('shortDescription').optional().trim().isLength({ min: 5, max: 200 }),
  body('category').optional().isIn(['bot', 'website', 'app', 'service', 'other']),
  body('pricing').optional().trim(),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Сервис не найден' });
    }

    // Проверка прав доступа
    if (service.owner.toString() !== req.user.userId && req.userData.role !== 'admin') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    Object.keys(req.body).forEach(key => {
      if (service[key] !== undefined) {
        service[key] = req.body[key];
      }
    });

    await service.save();

    res.json({
      message: 'Сервис обновлен',
      service
    });
  } catch (error) {
    console.error('Ошибка обновления сервиса:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удаление сервиса (владелец или админ)
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Сервис не найден' });
    }

    // Проверка прав доступа
    if (service.owner.toString() !== req.user.userId && req.userData.role !== 'admin') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    await service.remove();

    res.json({ message: 'Сервис удален' });
  } catch (error) {
    console.error('Ошибка удаления сервиса:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение сервисов пользователя
router.get('/user/my-services', auth, async (req, res) => {
  try {
    const services = await Service.find({ owner: req.user.userId })
      .sort({ createdAt: -1 });
    
    res.json({ services });
  } catch (error) {
    console.error('Ошибка получения сервисов пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Увеличение кликов (публичный доступ)
router.post('/:id/click', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Сервис не найден' });
    }

    await service.incrementClicks();
    res.json({ message: 'Клик засчитан' });
  } catch (error) {
    console.error('Ошибка увеличения кликов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Админские маршруты
router.put('/:id/status', auth, requireRole(['admin']), [
  body('status').isIn(['active', 'inactive', 'pending'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Сервис не найден' });
    }

    service.status = req.body.status;
    await service.save();

    res.json({
      message: 'Статус сервиса обновлен',
      service
    });
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router; 