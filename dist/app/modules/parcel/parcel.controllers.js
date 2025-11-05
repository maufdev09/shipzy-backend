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
exports.ParcelControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const parcel_service_1 = require("./parcel.service");
const createParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_service_1.ParcelService.createParcel(req.body);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Parcel created successfully",
        data: parcel,
    });
}));
const cancelParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Id = req.params.id;
    const verifiedToken = req.user;
    const parcel = yield parcel_service_1.ParcelService.cancelParcel(Id, verifiedToken);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Parcel canceled successfully",
        data: parcel,
    });
}));
const senderParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(new Error("User not authenticated"));
    }
    const verifiedToken = req.user;
    const parcel = yield parcel_service_1.ParcelService.senderParcel(verifiedToken);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Parcel retrieved successfully",
        data: parcel,
    });
}));
const receiverParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const parcel = yield parcel_service_1.ParcelService.receiverParcel(verifiedToken);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Parcel retrieved successfully",
        data: parcel,
    });
}));
const confirmParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Id = req.params.id;
    const verifiedToken = req.user;
    const parcel = yield parcel_service_1.ParcelService.confirmParcel(Id, verifiedToken);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Parcel canceled successfully",
        data: parcel,
    });
}));
const statuslogParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Id = req.params.id;
    const verifiedToken = req.user;
    const parcel = yield parcel_service_1.ParcelService.statuslogParcel(Id, verifiedToken);
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Parcel canceled successfully",
        data: parcel,
    });
}));
const allParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_service_1.ParcelService.allParcels();
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Parcel canceled successfully",
        data: parcel,
    });
}));
const getParcelOverview = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield parcel_service_1.ParcelService.getParcelOverview();
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Parcelover view retrive successfully",
        data: result,
    });
}));
const getStatusDistrubution = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield parcel_service_1.ParcelService.getStatusDistrubution();
    (0, sendResponse_1.SendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "getStatusDistrubution view retrive successfully",
        data: result,
    });
}));
exports.ParcelControllers = {
    createParcel,
    cancelParcel,
    senderParcel,
    receiverParcel,
    confirmParcel,
    statuslogParcel,
    allParcels,
    getParcelOverview,
    getStatusDistrubution,
};
