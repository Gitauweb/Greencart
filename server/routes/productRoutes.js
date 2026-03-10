import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getCategories,
} from '../controllers/productController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);

// Protected routes (seller/admin)
router.post('/', authenticateUser, createProduct);
router.put('/:id', authenticateUser, updateProduct);
router.delete('/:id', authenticateUser, deleteProduct);

export default router;
