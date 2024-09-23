import { CreateSuccess } from "../middlewares/success.js";
import { v4 as uuid } from 'uuid';
import BlogTopic from "../models/BlogTopic.js";


export const getAllBlogTopics = async (req, res, next) => {
    try {
        const blogTopic = await BlogTopic.find({});
        return next(CreateSuccess(200, 'Blog topic fetched successfully.', blogTopic));
    } catch (error) {
        console.log('Error catched on fetching all blog topics: ', error);
    }
};


export const addBlogTopic = async (req, res, next) => {
    try {
        if (req.body) {
            const newBlogTopic = new BlogTopic({ ...req.body, _id: uuid() });
            await newBlogTopic.save();
            return res.send();
        } else {
            return res.status(400).send("Body not applied for posting new blog topic.");
        }
    } catch (error) {
        console.log('Error catched on adding new blog topic: ', error);
    }
};


export const deleteBlogTopic = async (req, res, next) => {
    try {
        const blogTopic = await BlogTopic.findById(req.params.id);
        if (blogTopic) {
            await BlogTopic.findByIdAndDelete(req.params.id);
            return res.send();
        } else {
            return res.status(400).send('Blog topic for delete not found');
        }
    } catch (error) {
        console.log('Error catched on deleting blog topic: ', error);
    }
};