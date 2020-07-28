"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const HttpError_1 = __importDefault(require("../models/HttpError"));
exports.notFoundHandler = (req, res, next) => {
    return next(new HttpError_1.default('Source not found', 404));
};
exports.errorHandler = (error, req, res, next) => {
    return res
        .status(error.code || 500)
        .json({ message: error.message, code: error.code });
};
//# sourceMappingURL=error.js.map