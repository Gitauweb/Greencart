import express from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/:productId', getProductReviews);

// Protected routes
router.post('/:productId', authenticateUser, createReview);
router.put('/:id', authenticateUser, updateReview);
router.delete('/:id', authenticateUser, deleteReview);

export default router;
