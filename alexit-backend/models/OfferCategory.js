import mongoose from "mongoose";



const OfferCategorySchema = mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true }
}, { versionKey: false });


export default mongoose.model("OfferCategory", OfferCategorySchema);