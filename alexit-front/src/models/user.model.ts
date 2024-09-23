export interface User {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    isAdmin: boolean;
    role: string;
    shippingAddress: { country: string, city: string, street: string, zip: string, phone: string };
    cart: { id: string; product_id: string, quantity: number }[];
    favoriteProducts: string[];
    purchaseHistory: string[];
    previouslyViewed: string[];
}