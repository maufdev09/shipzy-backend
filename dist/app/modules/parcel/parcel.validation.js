"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParcelZodSchema = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
const zod_1 = __importDefault(require("zod"));
exports.createParcelZodSchema = zod_1.default.object({
    type: zod_1.default.enum(parcel_interface_1.TParcelType),
    weight: zod_1.default.number().min(0, "Weight must be a positive number"),
    fee: zod_1.default.number().optional(),
    sender: zod_1.default.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
        message: "Invalid sender ID format",
    }),
    receiver: zod_1.default.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
        message: "Invalid receiver ID format",
    }),
    senderAddress: zod_1.default.string().min(1, "Sender address is required"),
    receiverAddress: zod_1.default.string().min(1, "Receiver address is required"),
    deliveryDate: zod_1.default.string().optional(),
});
