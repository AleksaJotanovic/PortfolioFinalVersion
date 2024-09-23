import mongoose from 'mongoose';



const OfferSchema = mongoose.Schema({
    _id: { type: String, required: true },
    category_id: { type: String, required: true },
    title: { type: String, required: true },
    featuredImage: { type: String, required: true },
    text: { type: String },
    products: [String],
    discountImpact: { type: Number },
    published: { type: Boolean, required: true },
    date: { created: { type: String, required: true }, expires: { type: String, required: true } }
}, { versionKey: false });



export default mongoose.model("Offer", OfferSchema);