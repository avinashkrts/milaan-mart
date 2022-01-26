import { Device } from "./device.modules";

export interface Image {
    id: Number,
    productId: Number,
    shopId: String,
    avatarName: String,
    createdOn: String,
    image: String | null,
    active: Boolean,
    deleted: Boolean
}