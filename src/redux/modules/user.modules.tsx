import { Device } from "./device.modules";

export interface User {
    userId: Number,
    emailId: String,
    firstName: String,
    lastName: String,
    userType: Number,
    name: String,
    token: String,
    wishCount: Number,
    displayName: String,
    createdOn: String,
    mobileNo: String,
    wishList: String,
    isActive: Boolean,
    pwd: String,
    otp: String,
    dues: Number,
    duesStatus: Boolean,
    avatar: String,
    shopId: String,
    gender: Number,
    walletBalance: Number,
    playerId: String,
    logedIn: Boolean,
    address: null,
    lastLoginDate: String,
    userDeviceIDList?: Device[]
    lastPaid: Number,
    lastPaidOn: String,
    deleted: Boolean
}