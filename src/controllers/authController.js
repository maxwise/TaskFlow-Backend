import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

function normalizeEmail(value = '') {
  return value.trim().toLowerCase();
}

function authenticationResponse(user) {
  return {
    token: generateToken(user.id),
    user: user.toJSON(),
  };
}

export async function register(req, res) {
  const name = String(req.body.name || '').trim();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must contain at least 8 characters.' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'An account with that email address already exists.' });
  }

  const user = await User.create({ name, email, password });
  return res.status(201).json(authenticationResponse(user));
}

export async function login(req, res) {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email }).select('+password');
  const passwordMatches = user ? await user.comparePassword(password) : false;

  if (!user || !passwordMatches) {
    return res.status(401).json({ message: 'The email or password is incorrect.' });
  }

  return res.json(authenticationResponse(user));
}

export async function getCurrentUser(req, res) {
  return res.json({ user: req.user.toJSON() });
}
