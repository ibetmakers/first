import { authAPI } from './auth';

export interface Message {
  _id: string;
  chatId: string;
  sender: {
    _id: string;
    username: string;
    profile: {
      name: string;
      avatar?: string;
    };
  };
  receiver: {
    _id: string;
    username: string;
    profile: {
      name: string;
    };
  };
  content: string;
  messageType: 'text' | 'image' | 'file';
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  _id: string;
  chatId: string;
  participants: Array<{
    _id: string;
    username: string;
    profile: {
      name: string;
      avatar?: string;
    };
  }>;
  lastMessage?: {
    content: string;
    sender: {
      _id: string;
      username: string;
      profile: {
        name: string;
      };
    };
    timestamp: string;
  };
  unreadCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class MessagesAPI {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getChats(): Promise<Chat[]> {
    const response = await fetch('/api/messages/chats', {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении чатов');
    }

    return response.json();
  }

  async getMessages(chatId: string, page: number = 1, limit: number = 50): Promise<Message[]> {
    const response = await fetch(`/api/messages/chats/${chatId}/messages?page=${page}&limit=${limit}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении сообщений');
    }

    return response.json();
  }

  async sendMessage(receiverId: string, content: string, messageType: 'text' | 'image' | 'file' = 'text'): Promise<Message> {
    const response = await fetch('/api/messages/send', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        receiverId,
        content,
        messageType,
      }),
    });

    if (!response.ok) {
      throw new Error('Ошибка при отправке сообщения');
    }

    return response.json();
  }

  async getUnreadCount(): Promise<{ unreadCount: number }> {
    const response = await fetch('/api/messages/unread-count', {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Ошибка при получении количества непрочитанных сообщений');
    }

    return response.json();
  }

  async startChatWithService(serviceId: string): Promise<{
    chatId: string;
    service: {
      _id: string;
      name: string;
      owner: {
        _id: string;
        username: string;
        profile: {
          name: string;
        };
      };
    };
  }> {
    const response = await fetch(`/api/messages/start-chat/${serviceId}`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Ошибка при создании чата с сервисом');
    }

    return response.json();
  }
}

export const messagesAPI = new MessagesAPI(); 