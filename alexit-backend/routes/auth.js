import express from "express";
import { customerLogin, login, register, resetPassword, sendPasswordResetEmail, } from "../controllers/auth.controller.js";



const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/customer-login', customerLogin);
router.post('/send-email', sendPasswordResetEmail);
router.post('/reset-password', resetPassword);



export default router;