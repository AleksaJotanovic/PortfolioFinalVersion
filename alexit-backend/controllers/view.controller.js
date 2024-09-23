import { CreateError } from "../middlewares/error.js";
import { CreateSuccess } from "../middlewares/success.js";
import View from "../models/View.js";
import { v4 as uuid } from "uuid";


export const addView = async (req, res, next) => {
    try {
        if (req.body) {
            const newView = new View({ ...req.body, _id: uuid() });
            await newView.save();
            return res.send();
        } else {
            return res.status(400).send("View controller says: Job done :)");
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};


export const getViewById = async (req, res, next) => {
    try {
        const view = await View.findById(req.params.id);
        if (!view) {
            return next(CreateError(404, "View controller says: View not found :("));
        } else {
            return next(CreateSuccess(200, "View controller says: View found :)", view));
        }
    } catch (error) {
        return next(CreateError(500, "View controller says: Error catched while getting specified view :("));
    }
};

export const updateView = async (req, res, next) => {
    try {
        const view = await View.findById(req.params.id);
        if (!view) {
            return res.status(400).send("View controller says: Error while updating view :(");
        } else {
            await View.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            return res.send();
        }
    } catch (error) {
        return res.status(500).send("View controller says: Error catched while updating view :(");
    }
};