import Courier from "../models/Courier.js";
import { CreateError } from "../middlewares/error.js";
import { CreateSuccess } from "../middlewares/success.js";
import { v4 as uuid } from "uuid";



export const getAllCouriers = async (req, res, next) => {
    try {
        const couriers = await Courier.find({});
        return next(CreateSuccess(200, "Courier controller says: Fetching couirers successfull :)", couriers));
    } catch (error) {
        return next(CreateError(500, "Courier controller says: Error catched at fetching couriers :("));
    }
};


export const addCourier = async (req, res, next) => {
    try {
        if (req.body) {
            const newCourier = new Courier({ ...req.body, _id: uuid() });
            await newCourier.save();
            return res.send();
        } else {
            return res.status(400).send("Courier controller says: Failed to create courier :(");
        }
    } catch (error) {
        return res.status(500).send("Courier controller says: Error catched at creating courier :(");
    }
};


export const deleteCourier = async (req, res, next) => {
    try {
        const courier = await Courier.findById(req.params.id);
        if (courier) {
            await Courier.findByIdAndDelete(req.params.id);
            return res.send();
        } else {
            return res.status(400).send("Courier for deleting not found :(");
        }
    } catch (error) {
        return res.status(500).send("Error catched at deleting courier :(");
    }
};
