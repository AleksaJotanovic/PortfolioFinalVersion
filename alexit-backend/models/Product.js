import mongoose from "mongoose";

const specificationsSchema = mongoose.Schema({
    key: { type: String },
    value: { type: String }
}, { _id: false });

const ProductSchema = mongoose.Schema({
    _id: { type: String, required: true },
    category_id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    uom: { type: String, required: true },
    sku: { type: String, required: true },
    price: {
        margin: { type: Number, required: true },
        purchase: { type: Number, required: true },
        regular: { type: Number, required: true },
        sale: { type: Number, required: true },
        earning: { type: Number, required: true },
        discount: {
            value: { type: Number, required: true },
            activationDate: { type: String, default: "" }
        }
    },
    images: [String],
    specifications: [specificationsSchema],
    inStock: { type: Number, required: true },
    weight: { type: Number, required: true },
    published: { type: Boolean, required: true },
    creationDate: { type: String, required: true },
    includedAsRecommended: { type: Boolean, required: true }
}, { versionKey: false });



export default mongoose.model("Product", ProductSchema);