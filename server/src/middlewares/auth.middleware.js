import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/user.repository.js';
import AppError from '../utils/AppError.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Not authorized, no token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userRepository.findUserById(decoded.userId);

    if (!user) {
      throw new AppError('Not authorized, user not found', 401);
    }

    // Attach user to request (excluding password) so controllers can use req.user
    req.user = { id: user.id, name: user.name, email: user.email };

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new AppError('Not authorized, invalid token', 401));
    }
    next(err);
  }
};