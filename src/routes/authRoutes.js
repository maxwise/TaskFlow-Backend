import { Router } from 'express';
import { getCurrentUser, login, register } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);

export default router;
