import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';   
import {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

//For Public Route

router.get('/', getCategories);

//For Admin Route
router.post('/', authMiddleware, authorizeRoles('admin'), createCategory);
router.put('/:id', authMiddleware, authorizeRoles('admin'), updateCategory);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), deleteCategory);

export default router;