import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Eye, MousePointer, ExternalLink, MessageCircle } from 'lucide-react';
import { servicesAPI, Service } from '../api/services';
import StartChatButton from '../components/messenger/StartChatButton';

const ServicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await servicesAPI.getServiceById(id);
        setService(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bot':
        return '🤖';
      case 'website':
        return '🌐';
      case 'app':
        return '📱';
      case 'service':
        return '⚙️';
      default:
        return '🔧';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'bot':
        return 'Бот';
      case 'website':
        return 'Веб-сайт';
      case 'app':
        return 'Приложение';
      case 'service':
        return 'Сервис';
      default:
        return 'Другое';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Ошибка
            </h1>
            <p className="text-red-600">
              {error || 'Сервис не найден'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {/* Banner */}
          <div className="relative h-64 bg-gradient-to-br from-primary-100 to-secondary-100">
            {service.banner ? (
              <img
                src={service.banner}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-8xl">{getCategoryIcon(service.category)}</div>
              </div>
            )}
            
            {/* Premium Badge */}
            {service.isPremium && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Premium
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-secondary-700 px-3 py-1 rounded-full text-sm font-medium">
              {getCategoryName(service.category)}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                {service.logo ? (
                  <img
                    src={service.logo}
                    alt={`${service.name} logo`}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">{getCategoryIcon(service.category)}</span>
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {service.name}
                  </h1>
                  <p className="text-gray-600">
                    от {service.owner.profile.name}
                  </p>
                </div>
              </div>
              
              {/* Кнопка начать чат */}
              <div className="flex-shrink-0">
                <StartChatButton
                  serviceId={service._id}
                  serviceName={service.name}
                  variant="primary"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 mb-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{service.rating.average.toFixed(1)}</span>
                <span>({service.rating.count})</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{service.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MousePointer className="w-4 h-4" />
                <span>{service.clicks}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Описание
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {service.fullDescription || service.shortDescription}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
              <StartChatButton
                serviceId={service._id}
                serviceName={service.name}
                variant="outline"
                className="flex-1"
              />
              <button className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                <ExternalLink className="w-4 h-4" />
                <span>Перейти к сервису</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicePage; 