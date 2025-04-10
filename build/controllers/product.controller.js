"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProductController = void 0;
const product_service_1 = require("../services/product.service");
const catchAsyncError_1 = require("../utils/catchAsyncError");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const ErrorMessage_1 = require("../constants/ErrorMessage");
exports.getAllProductController = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const results = await (0, product_service_1.getAllProductService)();
        if (results) {
            return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.PRODUCT_NOT_FOUND, ErrorMessage_1.RESPONSE_STATUS.DATA_NOT_FOUND));
        }
        res
            .status(200)
            .json({ msg: "All product fetched successfully", data: results });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR, ErrorMessage_1.RESPONSE_STATUS.INTERNAL_SERVER_ERROR));
    }
});
