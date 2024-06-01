export interface IInvoicePayload {
    title: string;
    businessName?: string;
    taxNumber?: string;
    customerName: string;
    customerEmail: string;
    customerBillingAddress: string;
    companyName: string;
    companySalesEmail: string;
    companyAddress: string;
    companyAccountNumber: string;
    companyAccountName: string;
    companyAccountBranch: string;
    companyAccountBranchCode: string;
    invoiceNumber: string;
    orderDate: string;
    orderDueDate: string;
    items: IInvoicePayloadItem[];
    subTotal: string;
    deliveryFee: string;
    vat: string;
    total: string;
    orderId?: string;
}

export interface IInvoicePayloadItem {
    itemNumber: number;
    description: string;
    price: string;
    quantity: number;
    total: string;
}