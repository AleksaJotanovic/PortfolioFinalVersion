import mongoose from "mongoose";



const SaleSchema = mongoose.Schema({
    _id: { type: String, required: true },
    group_id: { type: String, required: true },
    uom: { type: String, required: true },
    articleCode: { type: String, required: true },
    articleName: { type: String, required: true },
    quantity: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    margin: { type: Number, required: true },
    pricePerUom: { type: Number, required: true },
    taxBase: { type: Number, required: true },
    vatRate: { type: Number, required: true },
    vat: { type: Number, required: true },
    saleValue: { type: Number, required: true },
    earned: { type: Number, required: true },
    createdAt: { type: String, required: true }
}, { versionKey: false });



export default mongoose.model("Sale", SaleSchema);