import express from 'express';
import { addBlogTopic, deleteBlogTopic, getAllBlogTopics } from '../controllers/blogtopic.controller.js';



const router = express.Router();

router.get('/', getAllBlogTopics);
router.post('/add', addBlogTopic);
router.delete('/delete/:id', deleteBlogTopic);

export default router;