const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.userData) {
        return res.status(401).json({ message: 'Требуется авторизация' });
      }

      if (!roles.includes(req.userData.role)) {
        return res.status(403).json({ message: 'Недостаточно прав' });
      }

      next();
    } catch (error) {
      console.error('Ошибка проверки роли:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  };
};

module.exports = requireRole; 