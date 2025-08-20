"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
const counters_model_1 = require("../../utils/counters.model");
const statusLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.TParcelStatus),
        required: true,
    },
    timestamp: { type: Date, default: Date.now },
    location: { type: String, required: false },
    updatedBy: { type: String, required: false },
}, {
    versionKey: false,
    _id: false,
});
const parcelSchema = new mongoose_1.Schema({
    trackingId: { type: String, unique: true },
    type: { type: String, enum: Object.values(parcel_interface_1.TParcelType), required: true },
    weight: { type: Number, required: true },
    fee: { type: Number, required: true },
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    senderAddress: { type: String, required: true },
    receiverAddress: { type: String, required: true },
    deliveryDate: { type: Date, required: false },
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.TParcelStatus),
        default: parcel_interface_1.TParcelStatus.REQUESTED,
    },
    statusLog: [statusLogSchema],
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false,
});
parcelSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.trackingId) {
            const date = new Date();
            const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, "");
            const seq = yield (0, counters_model_1.getNextSequence)("parcelId");
            this.trackingId = `${yyyymmdd}-${seq.toString().padStart(6, "0")}`;
        }
        next();
    });
});
exports.Parcel = (0, mongoose_1.model)("Parcel", parcelSchema);
