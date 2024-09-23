export interface Category {
    _id: string;
    name: string;
    parent_id: string;
    configuratorField: string;
    specifications: { key: string, values: string[] }[];
    image: string;
}