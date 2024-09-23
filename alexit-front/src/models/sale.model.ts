export interface Sale {
    _id: string;
    group_id: string;
    uom: string;
    articleCode: string;
    articleName: string;
    purchasePrice: number;
    margin: number;
    quantity: number;
    pricePerUom: number;
    taxBase: number;
    vatRate: number;
    vat: number;
    saleValue: number;
    earned: number;
    createdAt: string;
}