import React from 'react';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Войти в аккаунт
          </h2>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-center text-gray-600 mb-6">
            Страница входа в разработке
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
            Войти
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 