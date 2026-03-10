import express from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';
import { users } from '../models/InMemoryUser.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateUser, getCurrentUser);

// Debug endpoint - view all users (development only)
router.get('/debug/users', (req, res) => {
  const userList = users.map(user => ({
    id: user._id,
    name: user.name,
    email: user.email,
    isSeller: user.isSeller,
    createdAt: user.createdAt,
    // Don't send passwords
  }));

  res.json({
    success: true,
    message: 'Registered users (in-memory storage)',
    totalUsers: users.length,
    users: userList,
    note: 'Data is temporary and will be lost when server restarts'
  });
});

export default router;

