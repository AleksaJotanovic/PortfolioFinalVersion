import express from 'express';
import { addOrder, deleteOrder, getAllOrders, sendAccounting, sendStatusEmail, updateOrder } from '../controllers/order.controller.js';



const router = express.Router();

router.get('/', getAllOrders);
router.post('/add', addOrder);
router.put('/update/:id', updateOrder);
router.delete('/delete/:id', deleteOrder);
router.post('/send-status-email', sendStatusEmail);
router.post('/send-accounting', sendAccounting);



export default router;