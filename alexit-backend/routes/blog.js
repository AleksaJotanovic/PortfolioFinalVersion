import express from "express";
import { createBlog, deleteBlog, getAllBlogs, getBlogById, updateBlog, uploadGalleries, uploadImage } from "../controllers/blog.controller.js";
import { blogsFeaturedUpload, blogsGalleriesUpload, blogsSinglesUpload } from "../middlewares/multer-config.js";


const router = express.Router();

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/create', createBlog);
router.put('/update/:id', updateBlog);
router.delete('/delete/:id', deleteBlog);
router.post('/upload-single', blogsSinglesUpload.single('file'), uploadImage);
router.post('/upload-gallery', blogsGalleriesUpload.array('files'), uploadGalleries);
router.post('/upload-featured', blogsFeaturedUpload.single('file'), uploadImage);

export default router;