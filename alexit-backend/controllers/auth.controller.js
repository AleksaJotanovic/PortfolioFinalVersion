import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { CreateError } from '../middlewares/error.js';
import { CreateSuccess } from '../middlewares/success.js';
import UserToken from "../models/UserToken.js";
import { v4 as uuid } from "uuid";



export const register = async (req, res, next) => {
    try {
        if (req.body) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt);

            const newUser = new User({ ...req.body, password: hashPassword, _id: uuid() });
            await newUser.save();
            return res.send();
        } else {
            return res.status(400).send("Auth controller says: Failed to create user :(");
        }
    } catch (error) {
        return console.log(error);
    }
};


export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).send("Auth controller says: Failed to login.");
        } else {
            if (user.role === 'Admin') {
                const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
                if (!isPasswordCorrect) {
                    return res.status(400).send("Password is incorrect.");
                } else {
                    const token = jwt.sign({ id: user._id, roleName: user.role }, process.env.JWT_SECRET);
                    res.cookie("access_token", token, { httpOnly: false }).status(200).json({
                        status: 200,
                        message: "Login success!",
                        data: user
                    });
                }
            } else {
                console.log(user.role);
            }
        }

    } catch (error) {
        return res.status(500).send(error);
    }
};


export const customerLogin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });


        if (!user) {
            return res.status(400).send("Auth controller says: Failed to login.");
        } else {
            if (user.role === 'Customer') {
                const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
                if (!isPasswordCorrect) {
                    return res.status(400).send("Password is incorrect.");
                } else {
                    const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000;
                    const expirationDate = new Date(Date.now() + sixMonths);
                    const token = jwt.sign({ id: user._id, roleName: user.role }, process.env.JWT_SECRET);
                    res.cookie("customer_token", token, { httpOnly: false, expires: expirationDate }).status(200).json({
                        status: 200,
                        message: "Login success!",
                        data: user
                    });
                }
            } else {
                console.log(user.role);
            }
        }

    } catch (error) {
        return res.status(500).send(error);
    }
};



export const sendPasswordResetEmail = async (req, res, next) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: { $regex: '^' + email + '$', $options: 'i' } });
        if (!user) {
            return res.status(400).send("User not found.");
        } else {
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: 300 });
            const newToken = new UserToken({ user_id: user._id, token: token });

            const mailTransporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.APP_EMAIL,
                    pass: process.env.APP_PASSWORD
                }
            });
            const mailDetails = {
                from: process.env.APP_EMAIL,
                to: email,
                subject: "Reset Password!",
                html: `
                <html>
                    <head>
                        <title>Password Reset Request</title>
                    </head>
                    <body>
                        <h1>Password Reset Request</h1>
                        <p>Dear ${user.username},</p>
                        <p>We have received a request to reset your password for your account. To complete the password reset process, please click on the button below:</p>
                        <a href="${process.env.LIVE_URL}/${user.role.toLowerCase()}/reset/${token.replace('.', '-').replace('.', '-')}">
                        <button style="background-color: #46af50; color: white; padding: 14px 20px; border: none; cursor: pointer; border-radius: 4px;">Reset Password</button>
                        </a>
                        <p>Please note that this link is only valid for a 5 minutes. If you did not request a password reset, please disregard this message.</p>
                        <p>Thank you.</p>
                        <a href="${process.env.LIVE_URL}/${user.role.toLowerCase()}/reset/${token.replace('.', '-').replace('.', '-')}">
                        ${process.env.LIVE_URL}/${user.role.toLowerCase()}/reset/${token.replace('.', '-').replace('.', '-')}
                        </a>
                    </body>
                </html> 
                `
            };
            mailTransporter.sendMail(mailDetails, async (err) => {
                if (err) {
                    console.log(err);
                    return next(CreateError(400, "Error sending email."));
                } else {
                    await newToken.save();
                    return next(CreateSuccess(200, `Link for password reset is sent to ${email}`));
                }
            });
        }
    } catch (error) {
        return next(CreateSuccess(400, "Error catched in mail sending", error));
    }
};


export const resetPassword = async (req, res, next) => {
    const token = req.body.token;
    const newPassword = req.body.password;

    jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
        if (err) {
            return next(CreateError(400, "Reset link is expired."));
        } else {
            const user = await User.findOne({ email: { $regex: '^' + data.email + '$', $options: 'i' } });
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(newPassword, salt);
            user.password = encryptedPassword;
            try {
                await User.findOneAndUpdate({ _id: user._id }, { $set: user }, { new: true });
                return next(CreateSuccess(200, "Password changed successfully!"));
            } catch (error) {
                return next(CreateError(500, "Error catched in password reset"));
            }
        }
    });
};

