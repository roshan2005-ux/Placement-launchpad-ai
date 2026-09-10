import jwt from 'jsonwebtoken';

export const generateToken = (userId, role = 'student') => {
  const secret = process.env.JWT_SECRET || 'placement_launchpad_jwt_secret_dev_key_2026';
  return jwt.sign({ id: userId, role }, secret, {
    expiresIn: '7d',
  });
};
