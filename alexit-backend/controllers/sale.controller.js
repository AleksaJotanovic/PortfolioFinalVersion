import { CreateError } from "../middlewares/error.js";
import { CreateSuccess } from "../middlewares/success.js";
import Sale from "../models/Sale.js";
import { v4 as uuid } from "uuid";



export const getAllSales = async (req, res, next) => {
    try {
        const sales = await Sale.find({});
        if (sales) {
            return next(CreateSuccess(200, "Sales fetched!", sales));
        } else {
            return next(CreateError(400, "Sales not found!"));
        }
    } catch (error) {
        return next(CreateSuccess(500, "Error catched in sales get!", error));
    }
};

export const addSale = async (req, res, next) => {
    try {
        if (req.body) {
            const newSale = new Sale({ ...req.body, _id: uuid() });
            await newSale.save();
            return res.send();
        } else {
            return res.status(400).send("Error while adding sale.");
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};