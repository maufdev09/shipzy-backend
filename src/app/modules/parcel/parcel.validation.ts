import { Types } from "mongoose";
import { TParcelType } from "./parcel.interface";
import z from "zod";



export const  createParcelZodSchema=z.object({

    type: z.enum(TParcelType),
    weight: z.number().min(0, "Weight must be a positive number"),
    fee: z.number().optional(),
    sender: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid sender ID format",
    }),
    receiver: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid receiver ID format",
    }),
    senderAddress: z.string().min(1, "Sender address is required"),
    receiverAddress: z.string().min(1, "Receiver address is required"),
    deliveryDate: z.string().optional(),
})