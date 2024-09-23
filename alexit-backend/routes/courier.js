import express from 'express';
import { addCourier, deleteCourier, getAllCouriers } from '../controllers/courier.controller.js';



const router = express.Router();

router.get('/', getAllCouriers);
router.post('/add', addCourier);
router.delete('/delete/:id', deleteCourier);



export default router;