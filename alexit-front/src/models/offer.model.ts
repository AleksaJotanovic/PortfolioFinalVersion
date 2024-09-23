export interface Offer {
    _id: string;
    category_id: string;
    title: string;
    featuredImage: string;
    text: string;
    products: string[];
    discountImpact: number;
    published: boolean;
    date: { created: string, expires: string };
}