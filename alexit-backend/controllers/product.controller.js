import Product from "../models/Product.js";
import { CreateError } from "../middlewares/error.js";
import { CreateSuccess } from "../middlewares/success.js";
import { v4 as uuid } from "uuid";



export const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find({});
        return next(CreateSuccess(200, "Product controller says: Fetching products successfull :)", products));
    } catch (error) {
        return next(CreateSuccess(500, "Product controller says: Error catched in fetching products :("));
    }
};


export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(CreateError(400, "Product controller says: Fetching specified product failed :("));
        } else {
            return next(CreateSuccess(200, "Product controller says: Fetching specified product successfull :)", product));
        }
    } catch (error) {
        return next(CreateError(400, "Product controller says: Error catched in fetching specified product :("));
    }
};


export const addProduct = async (req, res, next) => {
    try {
        if (req.body) {
            const newProduct = new Product({ ...req.body, _id: uuid() })
            await newProduct.save();
            return res.send();
        } else {
            return res.status(400).send("Product controller says: Failed at creating product :(");
        }
    } catch (error) {
        console.log(error)
    }
};


export const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(400).send("Product controller says: Product for updating not found :(");
        } else {
            await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            return res.status(200).send();
        }
    } catch (error) {
        return res.status(500).send("Product controller says: Error catched in product updating :(");
    }
};


export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(400).send("Product controller says: Product for deleting not found :(");
        } else {
            await Product.findByIdAndDelete(req.params.id);
            return res.status(200).send();
        }

    } catch (error) {
        return res.status(500).send("Product controller says: bla blab");
    }
};


export const uploadProductImage = async (req, res, next) => {
    try {
        if (!req.files) {
            return res.status(400).send("Product controller says: Please choose images for product :(");
        } else {
            let modFiles = [];
            for (let file of req.files) {
                modFiles.push(`http://localhost:3000/products/${file.filename}`);
            }
            res.send(modFiles);
        }
    } catch (error) {
        return res.status(500).send("Product controller says: ", error);
    }
};
