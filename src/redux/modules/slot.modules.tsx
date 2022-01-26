import { Device } from "./device.modules";
import { Varient } from "./varient.modules";
import { VarientStock } from "./varientStock.modules";
import { Vender } from "./vender.modules";

export interface Slot {
    id: Number,
    slotDate: String,
    slotNumber: Number,
    nameOfSeller: String | null,
    billingAmount: Number,
    paidAmount: Number,
    gstAmount: Number,
    totalAmount: Number,
    dues: Number,
    billingNumber: String,
    shopId: String,
    itemListId: Number,
    createdOn: String,
    variantCount: Number,
    variantList: String,
    mobileNo: String | null,
    venderId: Number,
    creditDays: String,
    netAmount: Number,
    gstType: Number,
    itemList: Varient | null,
    variantStockList: VarientStock[] | null,
    variantStock: VarientStock | null,
    vender: Vender | null,
    active: Boolean,
    deleted: Boolean
}