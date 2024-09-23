import mongoose from 'mongoose';



const cartProductSchema = mongoose.Schema({
    id: { type: String },
    product_id: { type: String },
    quantity: { type: Number }
}, { _id: false });

const UserSchema = mongoose.Schema({
    _id: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    shippingAddress: {
        country: { type: String, required: true },
        city: { type: String, required: true },
        street: { type: String, required: true },
        zip: { type: String, required: true },
        phone: { type: String, required: true }
    },
    cart: [cartProductSchema],
    favoriteProducts: [String],
    purchaseHistory: [String],
    previouslyViewed: [String]
}, { versionKey: false });



export default mongoose.model("User", UserSchema);