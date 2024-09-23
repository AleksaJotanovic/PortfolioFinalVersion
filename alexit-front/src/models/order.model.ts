export interface Order {
    _id: string;
    number: string;
    user: { firstname: string, lastname: string, email: string, phone: string, country: string, city: string, street: string, zip: string, note: string };
    courier_id: string;
    pcBuild: boolean;
    pcBuildName: string;
    status: string;
    paid: boolean;
    items: { product_id: string, image: string, name: string, price: number, quantity: number, weight: number }[];
    weight: number;
    subtotal: number;
    shippingCost: number;
    grandTotal: number;
    creationTime: string;
    accountingSent: boolean;
    saleGenerated: boolean;
}