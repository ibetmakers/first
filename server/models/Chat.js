const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  chatId: {
    type: String,
    required: true,
    unique: true
  },
  lastMessage: {
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Метод для генерации уникального chatId
chatSchema.statics.generateChatId = function(userId1, userId2) {
  const sortedIds = [userId1.toString(), userId2.toString()].sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
};

// Метод для поиска или создания чата
chatSchema.statics.findOrCreateChat = async function(userId1, userId2) {
  const chatId = this.generateChatId(userId1, userId2);
  
  let chat = await this.findOne({ chatId });
  
  if (!chat) {
    chat = new this({
      participants: [userId1, userId2],
      chatId,
      unreadCount: new Map()
    });
    await chat.save();
  }
  
  return chat;
};

// Индекс для быстрого поиска чатов пользователя
chatSchema.index({ participants: 1 });

// Индекс для поиска по chatId
chatSchema.index({ chatId: 1 });

module.exports = mongoose.model('Chat', chatSchema); 