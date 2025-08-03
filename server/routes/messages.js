const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const User = require('../models/User');

// Получить все чаты пользователя
router.get('/chats', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ 
      participants: req.user._id,
      isActive: true 
    })
    .populate('participants', 'username profile.name profile.avatar')
    .populate('lastMessage.sender', 'username profile.name')
    .sort({ 'lastMessage.timestamp': -1 });

    // Добавить информацию о непрочитанных сообщениях
    const chatsWithUnread = chats.map(chat => {
      const unreadCount = chat.unreadCount.get(req.user._id.toString()) || 0;
      return {
        ...chat.toObject(),
        unreadCount
      };
    });

    res.json(chatsWithUnread);
  } catch (error) {
    console.error('Ошибка при получении чатов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить сообщения чата
router.get('/chats/:chatId/messages', auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({ chatId })
      .populate('sender', 'username profile.name profile.avatar')
      .populate('receiver', 'username profile.name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Отметить сообщения как прочитанные
    await Message.updateMany(
      { 
        chatId, 
        receiver: req.user._id, 
        isRead: false 
      },
      { 
        isRead: true, 
        readAt: new Date() 
      }
    );

    // Обновить счетчик непрочитанных сообщений в чате
    await Chat.findOneAndUpdate(
      { chatId },
      { 
        $set: { 
          [`unreadCount.${req.user._id}`]: 0 
        } 
      }
    );

    res.json(messages.reverse());
  } catch (error) {
    console.error('Ошибка при получении сообщений:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Отправить сообщение
router.post('/send', auth, async (req, res) => {
  try {
    const { receiverId, content, messageType = 'text' } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Необходимы receiverId и content' });
    }

    // Проверить существование получателя
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Получатель не найден' });
    }

    // Найти или создать чат
    const chat = await Chat.findOrCreateChat(req.user._id, receiverId);
    
    // Создать сообщение
    const message = new Message({
      chatId: chat.chatId,
      sender: req.user._id,
      receiver: receiverId,
      content,
      messageType
    });

    await message.save();

    // Обновить последнее сообщение в чате
    await Chat.findOneAndUpdate(
      { chatId: chat.chatId },
      {
        lastMessage: {
          content,
          sender: req.user._id,
          timestamp: new Date()
        },
        $inc: { [`unreadCount.${receiverId}`]: 1 }
      }
    );

    // Получить сообщение с данными отправителя
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username profile.name profile.avatar')
      .populate('receiver', 'username profile.name');

    res.json(populatedMessage);
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить количество непрочитанных сообщений
router.get('/unread-count', auth, async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error('Ошибка при получении количества непрочитанных сообщений:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Начать чат с сервисом
router.post('/start-chat/:serviceId', auth, async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Найти сервис и его владельца
    const Service = require('../models/Service');
    const service = await Service.findById(serviceId).populate('owner');
    
    if (!service) {
      return res.status(404).json({ message: 'Сервис не найден' });
    }

    const serviceOwnerId = service.owner._id;

    // Найти или создать чат
    const chat = await Chat.findOrCreateChat(req.user._id, serviceOwnerId);

    res.json({
      chatId: chat.chatId,
      service: {
        _id: service._id,
        name: service.name,
        owner: {
          _id: service.owner._id,
          username: service.owner.username,
          profile: service.owner.profile
        }
      }
    });
  } catch (error) {
    console.error('Ошибка при создании чата:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router; 