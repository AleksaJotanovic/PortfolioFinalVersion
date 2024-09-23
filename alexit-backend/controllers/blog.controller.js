import Blog from "../models/Blog.js";
import { CreateSuccess } from "../middlewares/success.js";



export const getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find({});
        return next(CreateSuccess(200, 'All blog fetched succesfully.', blogs));
    } catch (error) {
        console.log('Error catched on fetching all blogs: ', error);
    }
};

export const getBlogById = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            return next(CreateSuccess(200, 'Single blog fetched succesfully.', blog));
        } else {
            return next(CreateError(400, 'blog not found.'));
        }
    } catch (error) {
        console.log('Error catched on fetching single blog: ', error);
    }
};

export const createBlog = async (req, res, next) => {
    try {
        if (req.body) {
            const newBlog = new Blog({ ...req.body });
            await newBlog.save();
            return res.send();
        } else {
            return res.status(400).send('Creating blog: you must apply a body in request.');
        }
    } catch (error) {
        console.log('Error catched on posting blog: ', error);
    }
};

export const updateBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            await Blog.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            return res.status(200).send();
        } else {
            return res.status(400).send('blog for update not found.');
        }
    } catch (error) {
        console.log('Error catched on updating blog: ', error);
    }
};

export const deleteBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            await Blog.findByIdAndDelete(req.params.id);
            return res.status(200).send();
        } else {
            return res.status(400).send('Deleting blog: blog not found.');
        }
    } catch (error) {
        console.log('Error catched on deleting blog: ', error);
    }
};


export const uploadImage = async (req, res, next) => {
    try {
        if (req.file) {
            res.send({ data: req.file.filename });
        } else {
            res.status(400).send('File for blog image not found.');
        }
    } catch (error) {
        console.log('Error catched on blog image upload: ', error);
    }
};


export const uploadGalleries = async (req, res, next) => {
    try {
        if (req.files) {
            let modFiles = [];
            for (let file of req.files) {
                modFiles.push(`http://localhost:3000/blogs/galleries/${file.filename}`);
            }
            res.send(modFiles);
        } else {
            return res.status(400).send('Files for blog gallery not found.');
        }
    } catch (error) {
        console.log('Error catched on blog gallery upload: ', error);
    }
};