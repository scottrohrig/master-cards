import express from 'express';
import {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
} from '../controllers/categories.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', createCategory);
router.put('/:id', updateCategory);

export default router;
