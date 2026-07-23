import jwt from 'jsonwebtoken';

export function generateToken(userId) {
  return jwt.sign(
    {},
    process.env.JWT_SECRET,
    {
      subject: userId.toString(),
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      algorithm: 'HS256',
    },
  );
}
