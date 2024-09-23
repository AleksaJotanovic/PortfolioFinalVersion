import mongoose from 'mongoose';



const NewsletterSchema = mongoose.Schema({
    _id: { type: String, required: true },
    email: { type: String, required: true }
}, { versionKey: false });



export default mongoose.model("Newsletter", NewsletterSchema);