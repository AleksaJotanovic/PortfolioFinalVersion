import mongoose from "mongoose";



const itemsSchema = mongoose.Schema({
    product_id: { type: String, required: true },
    image: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    weight: { type: Number, required: true }
}, { _id: false });

const OrderSchema = mongoose.Schema({
    _id: { type: String, required: true },
    number: { type: String, required: true },
    user: {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String, required: true },
        zip: { type: String, required: true },
        note: { type: String, default: "" }
    },
    courier_id: { type: String, required: true },
    pcBuild: { type: Boolean, required: true },
    pcBuildName: { type: String },
    status: { type: String, required: true },
    paid: { type: Boolean, required: true },
    items: [itemsSchema],
    weight: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    creationTime: { type: String, required: true },
    accountingSent: { type: Boolean, required: true, default: false },
    saleGenerated: { type: Boolean, required: true, default: false }
}, { versionKey: false });



export default mongoose.model("Order", OrderSchema);