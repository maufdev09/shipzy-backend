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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelService = void 0;
const user_interface_1 = require("./../user/user.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const parcel_interface_1 = require("./parcel.interface");
const parcel_model_1 = require("./parcel.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const mongoose_1 = __importDefault(require("mongoose"));
const createParcel = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const statusLog = {
        status: parcel_interface_1.TParcelStatus.REQUESTED,
        timestamp: new Date(),
        location: payload.senderAddress,
        updatedBy: "System",
    };
    const parcel = yield parcel_model_1.Parcel.create(Object.assign(Object.assign({}, payload), { statusLog: [statusLog] }));
    return parcel;
});
const cancelParcel = (Id, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const parcel = yield parcel_model_1.Parcel.findById(Id).session(session);
        if (!parcel) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
        }
        if (parcel.sender.toString() !== decodedToken.userId &&
            decodedToken.role !== user_interface_1.Role.ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not allowed to cancel this parcel");
        }
        if (parcel.isBlocked || parcel.isDeleted) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not allowed to update isBlocked or isDeleted fields");
        }
        if (parcel.status === parcel_interface_1.TParcelStatus.APPROVED ||
            parcel.status === parcel_interface_1.TParcelStatus.REQUESTED) {
            const statusLog = {
                status: parcel_interface_1.TParcelStatus.CANCELED,
                timestamp: new Date(),
                location: parcel.senderAddress,
                updatedBy: `${decodedToken.role}`,
            };
            if (!parcel.statusLog) {
                parcel.statusLog = [];
            }
            parcel.statusLog.push(statusLog);
            parcel.status = parcel_interface_1.TParcelStatus.CANCELED;
            parcel.isBlocked = true;
            parcel.isDeleted = true;
            yield parcel.save({ session });
            yield session.commitTransaction();
            session.endSession();
            return parcel;
        }
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You Cant cancel the parcel");
    }
    catch (error) {
        yield session.abortTransaction();
        throw (error);
    }
    finally {
        session.endSession();
    }
});
const senderParcel = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = payload.userId;
    const parcel = yield parcel_model_1.Parcel.find({ sender: userId });
    return parcel;
});
const receiverParcel = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = payload;
    const parcel = yield parcel_model_1.Parcel.find({ receiver: userId });
    return parcel;
});
const confirmParcel = (Id, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const IfparcelExist = yield parcel_model_1.Parcel.findById(Id);
    if (!IfparcelExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    if (IfparcelExist.receiver.toString() !== decodedToken.userId &&
        decodedToken.role !== user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not allowed to confirm this parcel");
    }
    if (IfparcelExist.isBlocked ||
        IfparcelExist.isDeleted ||
        IfparcelExist.status === parcel_interface_1.TParcelStatus.CANCELED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not allowed to confirm isBlocked or isDeleted or cancaled parcel");
    }
    if (IfparcelExist.status === parcel_interface_1.TParcelStatus.APPROVED ||
        IfparcelExist.status === parcel_interface_1.TParcelStatus.REQUESTED) {
        const statusLog = {
            status: parcel_interface_1.TParcelStatus.DELIVERED,
            timestamp: new Date(),
            location: IfparcelExist.senderAddress,
            updatedBy: `${decodedToken.role}`,
        };
        if (!IfparcelExist.statusLog) {
            IfparcelExist.statusLog = [];
        }
        IfparcelExist.statusLog.push(statusLog);
        IfparcelExist.status = parcel_interface_1.TParcelStatus.DELIVERED;
        const parcel = yield IfparcelExist.save();
        return parcel;
    }
    throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Your delivered Successfully");
});
const statuslogParcel = (Id, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const IfparcelExist = yield parcel_model_1.Parcel.findById(Id);
    if (!IfparcelExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    if (IfparcelExist.receiver.toString() !== decodedToken.userId && IfparcelExist.sender.toString() !== decodedToken.userId &&
        decodedToken.role !== user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not allowed to get parcel status log ");
    }
    // 
    if (IfparcelExist.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "sorry! the parcel was deleted");
    }
    const statusLog = yield parcel_model_1.Parcel.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(Id) } },
        {
            $project: {
                _id: 1,
                trackingId: 1,
                status: 1,
                statusLog: {
                    $sortArray: { input: "$statusLog", sortBy: { timestamp: -1 } },
                },
            },
        },
    ]);
    return statusLog;
});
const allParcels = () => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.find();
    return parcel;
});
exports.ParcelService = {
    createParcel,
    cancelParcel,
    senderParcel,
    receiverParcel,
    confirmParcel,
    statuslogParcel,
    allParcels
};
