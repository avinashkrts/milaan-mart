export interface Product {
    id: Number,
    name: String,
    category: Number,
    brand: Number,
    shopId: String,
    review: String,
    measurement: Number,
    createdOn: String,
    shopName: String | null,
    description: String,
    title: String | null,
    itemList: String | null,
    image: String | null,
    active: Boolean,
    deleted: Boolean
}