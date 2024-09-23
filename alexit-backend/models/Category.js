import mongoose from "mongoose";



const SpecificationsSchema = mongoose.Schema({ key: { type: String, required: true }, values: [String] }, { _id: false });


const CategorySchema = mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    parent_id: { type: String },
    configuratorField: { type: String, default: "" },
    specifications: [SpecificationsSchema],
    image: { type: String, required: true },
}, { versionKey: false });



export default mongoose.model("Category", CategorySchema);