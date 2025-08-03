import React from 'react';

const TestNavbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900">Тест</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TestNavbar; 