import React from 'react';
import { useSimpleMessengerStore } from '../../stores/simpleMessengerStore';

const SimpleMessenger: React.FC = () => {
  const { isOpen, closeMessenger } = useSimpleMessengerStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Мессенджер</h2>
          <button
            onClick={closeMessenger}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-center text-gray-600">
          <p>Простой мессенджер работает!</p>
          <p className="mt-2 text-sm">Здесь будет функциональность чата</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleMessenger; 