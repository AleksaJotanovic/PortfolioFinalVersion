export interface Courier {
    _id: string;
    name: string;
    image: string;
    pricelist: { weight: { min: number; max: number }, price: number }[];
}