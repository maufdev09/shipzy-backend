"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlevalidationError = void 0;
const handlevalidationError = (err) => {
    const errorSources = [];
    const errors = Object.values(err.errors);
    errors.forEach((errorObject) => {
        errorSources.push({
            path: errorObject.path,
            message: errorObject.message,
        });
    });
    return {
        statusCode: 400,
        message: "Validation error",
        errorSources
    };
};
exports.handlevalidationError = handlevalidationError;
