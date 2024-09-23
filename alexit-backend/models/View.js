import mongoose from "mongoose";



const ViewSchema = mongoose.Schema({
    _id: { type: String, required: true },
    views: { type: Number, required: true }
}, { versionKey: false });


export default mongoose.model("View", ViewSchema);