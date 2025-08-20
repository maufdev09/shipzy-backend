import { Types } from 'mongoose';
export enum TParcelStatus {
    REQUESTED= "REQUESTED",
    APPROVED="APPROVED",
    DISPATCHED= "DISPATCHED",
    IN_TRANSIT= "IN_TRANSIT",
    DELIVERED= "DELIVERED",
    CANCELED= "CANCELED",
    RETURNED= "RETURNED"
};


export enum TParcelType {
    DOCUMENT = "DOCUMENT",
    PACKAGE = "PACKAGE",
    EXPRESS = "EXPRESS"
}

export interface IStatusLog {

    status: TParcelStatus;
    timestamp?: Date;
    location?: string;
    updatedBy?: string; 

}

export interface IParcel {

    _id?: string;
    trackingId?: string;
    type: TParcelType;
    weight: number;
    fee : number;
    sender:Types.ObjectId ;
    receiver: Types.ObjectId;
    senderAddress: string;
    receiverAddress: string;
    deliveryDate ?: Date;
    status?: TParcelStatus;
    statusLog?: IStatusLog[];
    isBlocked?: boolean;
    isDeleted?: boolean;


}