import express from "express";
import { addSale, getAllSales } from "../controllers/sale.controller.js";



const router = express.Router();

router.get('/', getAllSales);
router.post('/add', addSale);



export default router;