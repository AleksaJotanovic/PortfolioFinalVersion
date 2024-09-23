import { CreateSuccess } from "../middlewares/success.js";
import OfferCategory from "../models/OfferCategory.js";
import { v4 as uuid } from 'uuid';


export const getAllOfferCategories = async (req, res, next) => {
    try {
        const offerCategory = await OfferCategory.find({});
        return next(CreateSuccess(200, 'Offer category fetched successfully.', offerCategory));
    } catch (error) {
        console.log('Error catched on fetching all Offer categorys: ', error);
    }
};


export const addOfferCategory = async (req, res, next) => {
    try {
        if (req.body) {
            const newOfferCategory = new OfferCategory({ ...req.body, _id: uuid() });
            await newOfferCategory.save();
            return res.send();
        } else {
            return res.status(400).send("Body not applied for posting new offer category.");
        }
    } catch (error) {
        console.log('Error catched on adding new Offer category: ', error);
    }
};


export const deleteOfferCategory = async (req, res, next) => {
    try {
        const offerCategory = await OfferCategory.findById(req.params.id);
        if (offerCategory) {
            await OfferCategory.findByIdAndDelete(req.params.id);
            return res.send();
        } else {
            return res.status(400).send('Offer category for delete not found');
        }
    } catch (error) {
        console.log('Error catched on deleting offer category: ', error);
    }
};