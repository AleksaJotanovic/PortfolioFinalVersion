import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import categoryRoute from './routes/category.js';
import productRoute from './routes/product.js';
import userRoute from './routes/user.js';
import orderRoute from './routes/order.js';
import courierRoute from './routes/courier.js';
import authRoute from './routes/auth.js';
import saleRoute from './routes/sale.js';
import viewsRoute from './routes/view.js';
import NewsletterRoute from './routes/newsletter.js';
import ContactRoute from './routes/contact.js';
import fs from 'fs';
import BlogRoute from './routes/blog.js';
import BlogTopicRoute from './routes/blogtopic.js'
import OfferRoute from './routes/offer.js';
import OfferCategoryRoute from './routes/offercategory.js'



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use(express.static(__dirname + '/public'));
app.use('/api/category', categoryRoute);
app.use('/api/product', productRoute);
app.use('/api/user', userRoute);
app.use('/api/order', orderRoute);
app.use('/api/courier', courierRoute);
app.use('/api/auth', authRoute);
app.use('/api/sales', saleRoute);
app.use('/api/view', viewsRoute);
app.use('/api/newsletter', NewsletterRoute);
app.use('/api/contact', ContactRoute);
app.use('/api/blog', BlogRoute);
app.use('/api/blogTopic', BlogTopicRoute)
app.use('/api/offer', OfferRoute);
app.use('/api/offerCategory', OfferCategoryRoute);
app.use((obj, req, res, next) => {
    const statusCode = obj.status || 500;
    const message = obj.message || "Something went wrong!";
    return res.status(Number(statusCode)).json({
        success: [200, 201, 204].some(a => a === obj.status) ? true : false,
        status: statusCode,
        message: message,
        data: obj.data
    });
});

app.use('/api/any-file/delete', async (req, res, next) => {
    try {
        if (req.body.filePath) {
            const filePublicPath = req.body.filePath.replace('http://localhost:3000', 'public');
            fs.unlinkSync(filePublicPath);
            return res.send();
        } else {
            return res.status(400).send('Path to file you want to delete is not applied.');
        }
    } catch (error) {
        console.log('Error while deleting image in public.', error);
    }
});

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MONGODB SAYS: Connected to 'alexitdb' database!");
    } catch (error) {
        throw error;
    }
};
app.listen(3000, 'localhost', () => {
    connectMongoDB();
    console.log('BACKEND SAYS: Connected!');
});