import mongoose from 'mongoose';



const UserTokenSchema = mongoose.Schema({
    user_id: { type: String, required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }
});



export default mongoose.model("UserToken", UserTokenSchema);