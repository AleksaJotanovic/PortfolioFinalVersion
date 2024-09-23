import express from 'express';
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct, uploadProductImage } from '../controllers/product.controller.js';
import { productUpload } from '../middlewares/multer-config.js';


const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/add', addProduct);
router.delete('/delete/:id', deleteProduct);
router.put('/update/:id', updateProduct);
router.post('/upload-image', productUpload.array('files'), uploadProductImage);



export default router;