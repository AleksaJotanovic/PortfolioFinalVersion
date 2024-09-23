import express from 'express';
import { addOfferCategory, deleteOfferCategory, getAllOfferCategories } from '../controllers/offercategory.controller.js';


const router = express.Router();

router.get("/", getAllOfferCategories);
router.post("/add", addOfferCategory);
router.delete("/delete/:id", deleteOfferCategory);


export default router;