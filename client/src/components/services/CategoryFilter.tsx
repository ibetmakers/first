import React from 'react';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const categories = [
    { value: 'all', label: 'Все', icon: '🔍' },
    { value: 'bot', label: 'Боты', icon: '🤖' },
    { value: 'website', label: 'Веб-сайты', icon: '🌐' },
    { value: 'app', label: 'Приложения', icon: '📱' },
    { value: 'service', label: 'Сервисы', icon: '⚙️' },
    { value: 'other', label: 'Другое', icon: '🔧' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            selectedCategory === category.value
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
          }`}
        >
          <span className="mr-2">{category.icon}</span>
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter; 