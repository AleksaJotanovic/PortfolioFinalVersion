import mongoose from "mongoose";



const pricelistSchema = mongoose.Schema({
    weight: { min: { type: Number, required: true }, max: { type: Number, required: true } },
    price: { type: Number, required: true }
}, { _id: false });

const CourierSchema = mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    pricelist: [pricelistSchema],
}, { versionKey: false });



export default mongoose.model("Courier", CourierSchema);