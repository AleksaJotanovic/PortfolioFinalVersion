import mongoose from "mongoose";



const NewsletterSubscriptionToken = mongoose.Schema({
    email: { type: String, required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }
});



export default mongoose.model("NewsletterSubscriptionToken", NewsletterSubscriptionToken);