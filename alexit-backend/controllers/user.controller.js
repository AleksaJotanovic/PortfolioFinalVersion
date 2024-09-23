import User from "../models/User.js";
import { CreateSuccess } from "../middlewares/success.js";
import { CreateError } from "../middlewares/error.js";



export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        return next(CreateSuccess("200", "Fetching all users successfull!", users));
    } catch (error) {
        return res.status(500).send(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(CreateError(400, "Unsuccessfull user fetch!"));
        } else {
            return next(CreateSuccess(200, "User fetched!", user));
        }
    } catch (error) {
        return next(CreateSuccess(500, "Error catched in user fetch", error));
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).send("User controller says: Failed to update user :(");
        } else {
            await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            return res.status(200).send();
        }
    } catch (error) {
        return res.status(500).send("User controller says: Error catched at updating user :(");
    }
};


export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).send("User controller says: Failed to delete user :(");
        } else {
            await User.findByIdAndDelete(req.params.id);
            return res.status(200).send();
        }
    } catch (error) {
        return res.status(500).send("User controller says: Error catched at deleting user :(");
    }
};