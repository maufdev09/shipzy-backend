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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = payload, rest = __rest(payload, ["email", "password", "role"]);
    if (role) {
        if (role === user_interface_1.Role.ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not allowed to Register as Admin");
        }
    }
    const ifUserExists = yield user_model_1.User.findOne({ email });
    if (ifUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User already exists with this emaila");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUNDS));
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    const user = yield user_model_1.User.create(Object.assign({ email, password: hashedPassword, auth: [authProvider], role: role }, rest));
    return user;
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const ifUserExists = yield user_model_1.User.findById(userId);
    if (!ifUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.SENDER &&
            decodedToken.role !== user_interface_1.Role.RECEIVER) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not allowed to update user role");
        }
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are not allowed to update isActive, isDeleted or isVerified fields");
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUNDS));
    }
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return updatedUser;
});
const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.find();
    const total = yield user_model_1.User.countDocuments();
    return { user, total };
});
const getAllReceiver = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.find({ role: { $in: [user_interface_1.Role.RECEIVER, user_interface_1.Role.ADMIN] } });
    const total = yield user_model_1.User.countDocuments({ role: { $in: [user_interface_1.Role.RECEIVER, user_interface_1.Role.ADMIN] } });
    return { user, total };
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    return {
        data: user
    };
});
exports.UserService = {
    createUser,
    getAllUser,
    updateUser,
    getMe,
    getAllReceiver
};
