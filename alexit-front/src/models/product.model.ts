export interface Product {
    _id: string;
    category_id: string;
    name: string;
    description: string;
    uom: string;
    sku: string;
    price: { margin: number, purchase: number, regular: number, sale: number, earning: number, discount: { value: number, activationDate: string } };
    images: string[];
    specifications: { key: string, value: string }[];
    inStock: number;
    weight: number;
    published: boolean;
    creationDate: string;
    includedAsRecommended: boolean;
}