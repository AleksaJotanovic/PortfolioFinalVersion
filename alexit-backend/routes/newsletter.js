import express from "express";
import { addSubscriber, confirmSubscription, getAllSubscribers, sendNews } from "../controllers/newsletter.controller.js";



const router = express.Router();

router.get('/', getAllSubscribers)
router.post('/add-subscriber', addSubscriber);
router.post('/send-news', sendNews);
router.post('/confirm-subscription', confirmSubscription);



export default router;