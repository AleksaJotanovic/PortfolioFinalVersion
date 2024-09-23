import express from 'express';
import { addCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory, uploadCategoryImage } from '../controllers/category.controller.js';
import { categoryUpload } from '../middlewares/multer-config.js';



const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/add', addCategory);
router.put('/update/:id', updateCategory)
router.delete('/delete/:id', deleteCategory);
router.post('/upload-image', categoryUpload.single('file'), uploadCategoryImage);


export default router;