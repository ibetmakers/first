import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Eye, MousePointer, ExternalLink } from 'lucide-react';
import { servicesAPI } from '../../api/services';

interface ServiceCardProps {
  service: {
    _id: string;
    name: string;
    shortDescription: string;
    category: string;
    logo?: string;
    banner?: string;
    rating: {
      average: number;
      count: number;
    };
    views: number;
    clicks: number;
    isPremium: boolean;
    owner: {
      profile: {
        name: string;
        avatar?: string;
      };
    };
  };
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const handleClick = async () => {
    try {
      await servicesAPI.incrementClicks(service._id);
    } catch (error) {
      console.error('Ошибка при увеличении кликов:', error);
    }
  };

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

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link
        to={`/service/${service._id}`}
        onClick={handleClick}
        className="block"
      >
        <div className="card-hover overflow-hidden">
          {/* Banner Image */}
          <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100 overflow-hidden">
            {service.banner ? (
              <img
                src={service.banner}
                alt={service.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-6xl">{getCategoryIcon(service.category)}</div>
              </div>
            )}
            
            {/* Premium Badge */}
            {service.isPremium && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                Premium
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-secondary-700 px-2 py-1 rounded-full text-xs font-medium">
              {getCategoryName(service.category)}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {service.logo ? (
                  <img
                    src={service.logo}
                    alt={`${service.name} logo`}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{getCategoryIcon(service.category)}</span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors duration-200">
                    {service.name}
                  </h3>
                  <p className="text-sm text-secondary-500">
                    от {service.owner.profile.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-secondary-600 text-sm mb-4 line-clamp-2">
              {service.shortDescription}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-secondary-500">
              <div className="flex items-center space-x-4">
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
              
              <ExternalLink className="w-4 h-4 text-secondary-400 group-hover:text-primary-500 transition-colors duration-200" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ServiceCard; 