"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const config_1 = require("../config");
const zod_1 = require("zod");
const ValidationError_1 = require("../utils/ValidationError");
// Ensure correct typing of the middleware
const errorHandler = async (err, req, res, next) => {
    try {
        if (res.headersSent) {
            return next(err); // Pass to default error handler if headers already sent
        }
        if (err instanceof zod_1.ZodError) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: (0, ValidationError_1.formatZodError)(err),
                code: 'VALIDATION_ERROR',
            });
            return; // Ensure we don't call `next()` after sending a response
        }
        const statusCode = err.statusCode || 500;
        console.error(err);
        res.status(statusCode).json({
            success: false,
            message: err.message || 'Internal server error',
            code: statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR',
            ...(config_1.CONFIG.NODE_ENV === 'development' && { stack: err.stack }),
        });
    }
    catch (error) {
        next(error); // Handle unexpected errors gracefully
    }
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map