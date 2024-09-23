import express from "express";
import { addView, getViewById, updateView } from "../controllers/view.controller.js";



const router = express.Router();

router.get('/:id', getViewById);
router.post('/add', addView);
router.put('/update/:id', updateView);


export default router;