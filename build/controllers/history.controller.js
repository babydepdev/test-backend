"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readOrderHistoryByIdController = exports.getAllOrderHistoryController = void 0;
const history_service_1 = require("../services/history.service");
const catchAsyncError_1 = require("../utils/catchAsyncError");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const ErrorMessage_1 = require("../constants/ErrorMessage");
exports.getAllOrderHistoryController = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const results = await (0, history_service_1.getAllOrderHistoryService)();
        if (!results) {
            return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.ORDER_NOT_FOUND, ErrorMessage_1.RESPONSE_STATUS.DATA_NOT_FOUND));
        }
        res.status(200).json({
            msg: "All order history fetched successfully",
            data: results,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR, ErrorMessage_1.RESPONSE_STATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.readOrderHistoryByIdController = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.MISSING_REQUIRED_FIELD, ErrorMessage_1.RESPONSE_STATUS.MISSING_REQUIRED_FIELD));
        }
        const result = await (0, history_service_1.readOrderHistoryService)(userId);
        if (!result) {
            return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.ORDER_NOT_FOUND, ErrorMessage_1.RESPONSE_STATUS.DATA_NOT_FOUND));
        }
        res
            .status(200)
            .json({ msg: "Order history fetched successfully", data: result });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR, ErrorMessage_1.RESPONSE_STATUS.INTERNAL_SERVER_ERROR));
    }
});
