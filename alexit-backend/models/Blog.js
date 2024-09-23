import mongoose from "mongoose";


const ContentSchema = mongoose.Schema({ _id: { type: Number, required: true }, key: { type: String, required: true }, value: [String] });
const CommentsSchema = mongoose.Schema({ user_id: { type: String, required: true }, content: { type: String, required: true } }, { _id: false });

const BlogSchema = mongoose.Schema({
    _id: { type: String, required: true },
    topic_id: { type: String, required: true },
    title: { type: String, required: true },
    featuredImage: { type: String, required: true },
    content: [ContentSchema],
    published: { type: Boolean, required: true },
    date: { type: String, required: true },
    comments: [CommentsSchema]
}, { versionKey: false });


export default mongoose.model("Blog", BlogSchema);