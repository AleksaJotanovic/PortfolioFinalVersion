import Newsletter from "../models/Newsletter.js";
import { CreateError } from "../middlewares/error.js";
import { CreateSuccess } from "../middlewares/success.js";
import nodemailer from 'nodemailer';
import { v4 as uuid } from "uuid";
import jwt from 'jsonwebtoken';


export const getAllSubscribers = async (req, res, next) => {
    try {
        const subscribers = await Newsletter.find({});
        return next(CreateSuccess(200, "Fetching all subscribers successfull!", subscribers));
    } catch (error) {
        return next(CreateError(500, error));
    }
};

export const addSubscriber = async (req, res, next) => {
    try {
        if (req.body) {
            const newSubscriber = new Newsletter({ _id: uuid(), email: req.body.email });
            await newSubscriber.save();
            return res.send();
        } else {
            return res.status(400).send("Newsletter controller: you must enter a subscriber to add.");
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};


export const sendNews = async (req, res, next) => {

    const newCategorySubjectTitles = [
        "Expand Your Choices: Discover Our Newest Product Category!",
        "Exciting Additions Inside: Check Out Our Latest Product Category!",
        "Shop the Latest: Explore Our New Product Category!",
        "More Options, More Fun: New Product Category Now Live!",
        "Just In: Dive into Our Newest Product Category!",
        "Your Shopping Experience Upgraded: New Product Category Inside!",
        "Discover Something New: Latest Product Category Added!",
        "Upgrade Your Lifestyle: Explore Our New Product Category!",
        "Fresh Choices Await: Check Out Our Latest Product Category!",
        "New Arrivals Alert: Explore Our Latest Product Category!",
        "The Wait Is Over: New Product Category Unveiled!",
        "Enhance Your Selection: New Product Category Now Available!",
        "Dive Into Diversity: Explore Our Latest Product Category!",
        "Fresh Inventory Alert: Discover Our Newest Product Category!",
        "Revamp Your Shopping Experience: Latest Product Category Added!",
        "Your Preferences, Expanded: New Product Category Inside!",
        "Embrace Variety: Explore Our Latest Product Category!",
        "Find Your Favorites: New Product Category Just Added!",
        "Unlock New Possibilities: Latest Product Category Now Live!",
        "A World of Options: Explore Our New Product Category!",
    ];

    const newOfferSubjectTitles = [
        "Hot off the Press: New Offer Alert!",
        "Fresh Content Alert: Check Out Our Latest Offer!",
        "Just Released: Your Newest Offer Update!",
        "Discover What's New: Our Latest Offer Inside!",
        "Get Inspired: Brand New Offer Content Just for You!",
        "Unlock Insights: Dive into Our Newest Offer Entry!",
        "Don't Miss Out: Our Latest Offer is Now Live!",
        "Your Weekly Dose of Inspiration: New Offer Edition Inside!",
        "Stay Informed: Check Out Our Newest Offer!",
        "New Week, New Read: Our Latest Offer Update!",
        "Latest Offer Added: Dive Into Fresh Content Now!",
        "Explore Exciting Content: New Offer Just Published!",
        "Breaking News: Latest Offer Now Available!",
        "Feed Your Curiosity: Explore Our Newest Offer!",
        "Your Source for Updates: New Offer Alert Inside!",
        "Find Your Next Read: Latest Offer Inside!",
        "Discover Insights: New Offer Added to Our Collection!",
        "Fresh Perspectives Await: Dive Into Our Newest Offer!",
        "Stay Ahead of the Curve: Latest Offer Inside!",
        "A Must-Read: New Offer Just Released!",
    ];

    const newBlogSubjectTitles = [
        "Hot off the Press: New Blog Alert!",
        "Fresh Content Alert: Check Out Our Latest Blog!",
        "Just Released: Your Newest Blog Update!",
        "Discover What's New: Our Latest Blog Post Inside!",
        "Get Inspired: Brand New Blog Content Just for You!",
        "Unlock Insights: Dive into Our Newest Blog Entry!",
        "Don't Miss Out: Our Latest Blog is Now Live!",
        "Your Weekly Dose of Inspiration: New Blog Edition Inside!",
        "Stay Informed: Check Out Our Newest Blog Post!",
        "New Week, New Read: Our Latest Blog Update!",
        "Bite-Sized Wisdom: Dive Into Our Newest Blog Post!",
        "Exciting News Inside: Explore Our Latest Blog!",
        "Fresh Perspectives Await: Dive Into Our Newest Blog!",
        "In Case You Missed It: Latest Blog Now Available!",
        "Uncover Secrets: Latest Blog Post Inside!",
        "Latest Blog Alert: Explore Our Newest Entry!",
        "Fuel Your Imagination: New Blog Added!",
        "Stay Connected: Check Out Our Latest Blog Post!",
        "Read, Learn, Grow: Latest Blog Now Live!",
        "Your Source for Insights: Dive Into Our Latest Blog!",
    ];

    const randomSubject = (array) => {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    };

    try {
        const checkNewsType = () => {
            if (req.body.newsType === 'offer') {
                return randomSubject(newOfferSubjectTitles);
            } else if (req.body.newsType === 'blog') {
                return randomSubject(newBlogSubjectTitles);
            } else if (req.body.newsType === 'category') {
                return randomSubject(newCategorySubjectTitles);
            }
            return 'Newest update today!';
        }

        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.APP_PASSWORD
            }
        });
        const mailDetails = {
            from: process.env.APP_EMAIL,
            to: req.body.email,
            subject: checkNewsType(),
            html: req.body.content,
            attachments: [{
                path: req.body.image,
                cid: 'offerfeaturedslika'
            }]
        };

        mailTransporter.sendMail(mailDetails, async (err) => {
            if (err) {
                return next(CreateError(400, err));
            } else {
                return next(CreateSuccess(200, "Status change mail successfully sent :)"));
            }
        });
    } catch (error) {
        return next(CreateSuccess(500, "Error catched while sending news", error));
    }
};



export const confirmSubscription = async (req, res, next) => {
    try {
        const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET);
        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.APP_PASSWORD
            }
        });
        const mailDetails = {
            from: process.env.APP_EMAIL,
            to: req.body.email,
            subject: 'Newsletter Subscription Confirmation',
            html: `
            <html>
            <body>
                <h1>Click here to confirm your newsletter subscription</h1>
                <a href="${process.env.LIVE_URL}/confirm-newsletter-subscription/${token.replace('.', '-').replace('.', '-')}">
                <button style="background-color: #46af50; color: white; padding: 14px 20px; border: none; cursor: pointer; border-radius: 4px;">Confirm Subscription</button>
                </a>
            </body>
            </html> 
            `
        };

        mailTransporter.sendMail(mailDetails, async (err) => {
            if (err) {
                return next(CreateError(400, err));
            } else {
                return next(CreateSuccess(200, "Newsletter subscription confirm mail successfully sent!"));
            }
        });
    } catch (error) {
        return next(CreateSuccess(500, "Error catched while sending newsletter subscription confirmation :(", error));
    }
};