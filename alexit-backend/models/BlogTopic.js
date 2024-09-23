import mongoose from 'mongoose';



const BlogTopicSchema = mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true }
}, { versionKey: false });



export default mongoose.model("Blogtopic", BlogTopicSchema);