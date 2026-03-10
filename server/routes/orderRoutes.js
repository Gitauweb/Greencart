import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders,
} from '../controllers/orderController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(authenticateUser);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrder);

// Admin only
router.put('/:id', updateOrderStatus);
router.get('/admin/all', getAllOrders);

export default router;
