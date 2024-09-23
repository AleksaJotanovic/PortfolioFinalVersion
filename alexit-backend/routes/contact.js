import express from "express";
import { contact } from "../controllers/contact.controller.js";


const router = express.Router();

router.post('/send-message', contact);



export default router;