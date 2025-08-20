import { Types } from "mongoose";

export enum Role{
    ADMIN="ADMIN" ,
    SENDER="SENDER",
    RECEIVER="RECEIVER",
}

export interface IAuthProvider{
provider:"google" | "credentials";
providerId:string;
}

export enum IsActive{
    ACTIVE="ACTIVE",
    INACTIVE="INACTIVE",
    BLOCKED="BLOCKED"
}

export interface IUser{
    _id?: Types.ObjectId;
    name: string;
    phone?:string;
    email:string;
    password?: string;
    role?: Role;
    picture?:string;
    address?:string;
    isDeleted?:boolean;
    isActive?:IsActive;
    isVerified:boolean;
    parcels?:Types.ObjectId[]
    auth:IAuthProvider[]

}