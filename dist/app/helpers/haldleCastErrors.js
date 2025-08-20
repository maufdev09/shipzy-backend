"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerCastError = void 0;
const handlerCastError = (err) => {
    return {
        statusCode: 400,
        message: `Invalid mongoDB ObjectId. Please provide a valid Id`,
    };
};
exports.handlerCastError = handlerCastError;
