import { CreateError } from "../middlewares/error.js";
import { CreateSuccess } from "../middlewares/success.js";
import Offer from "../models/Offer.js";
import { v4 as uuid } from 'uuid';



export const getAllOffers = async (req, res, next) => {
    try {
        const offers = await Offer.find({});
        return next(CreateSuccess(200, 'All offers fetched succesfully.', offers));
    } catch (error) {
        console.log('Error catched on fetching all offers: ', error);
    }
};
export const getOfferById = async (req, res, next) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (offer) {
            return next(CreateSuccess(200, 'Single offer fetched successfully: ', offer));
        } else {
            return next(CreateError(400, 'Offer not found'));
        }
    } catch (error) {
        console.log('Error catched on fetching single offer: ', error);
    }
};
export const createOffer = async (req, res, next) => {
    try {
        if (req.body) {
            const newOffer = new Offer({ ...req.body });
            await newOffer.save();
            return res.send();
        } else {
            return res.status(400).send('Creating offer: you must apply a body in request.');
        }
    } catch (error) {
        console.log('Error catched on posting offer: ', error);
    }
};

export const updateOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (offer) {
            await Offer.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            return res.status(200).send();
        } else {
            return res.status(400).send('offer for update not found.');
        }
    } catch (error) {
        console.log('Error catched on updating offer: ', error);
    }
};

export const deleteOffer = async (req, res, next) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (offer) {
            await Offer.findByIdAndDelete(req.params.id);
            return res.status(200).send();
        } else {
            return res.status(400).send('Deleting offer: offer not found.');
        }
    } catch (error) {
        console.log('Error catched on deleting offer: ', error);
    }
};


export const uploadFeaturedImage = async (req, res, next) => {
    try {
        if (req.file) {
            res.send({ data: req.file.filename });
        } else {
            res.status(400).send('File for blog image not found.');
        }
    } catch (error) {
        console.log('Error catched on uploading offer featured image: ', error);
    }
};