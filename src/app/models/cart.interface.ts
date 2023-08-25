import { ICostBreakdown } from "./cost-breakdown.interface";
import { ICartItemPrintingInfo } from "./printing-info.interface";
import IProduct, { IImage } from "./product.interface";

export interface ICart {
    id?: string;
    userId: string;
    createdAt: Date;
    updatedAt: null | Date;
    isTemp: boolean;
    status: 'Active' | 'Completed' | 'Expired';
    cartItems?: ICartItem[];
}

export interface ICartItem {
    id?: string;
    cartId: string;
    printingInfoArr?: ICartItemPrintingInfo[];
    images?: IImage[];
    totalQuantity: number;
    productId: string;
    product?: IProduct;
    quantities?: any;
    totalPrice: number;
    createdAt: Date;
    updatedAt: null | Date;
    costBreakdown: ICostBreakdown;
    variation?: string;
}