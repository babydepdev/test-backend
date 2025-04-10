"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.topupController = void 0;
const catchAsyncError_1 = require("../utils/catchAsyncError");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const user_service_1 = require("../services/user.service");
const topup_service_1 = require("../services/topup.service");
const ErrorMessage_1 = require("../constants/ErrorMessage");
exports.topupController = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    const { userId } = req.params;
    const { wallet_topup } = req.body;
    if (!wallet_topup || !userId) {
        return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.MISSING_REQUIRED_FIELD, ErrorMessage_1.RESPONSE_STATUS.MISSING_REQUIRED_FIELD));
    }
    try {
        const isCheckUser = await (0, user_service_1.readUserByIdService)(userId);
        if (!isCheckUser) {
            return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.USER_NOT_FOUND, ErrorMessage_1.RESPONSE_STATUS.DATA_NOT_FOUND));
        }
        const result = await (0, topup_service_1.topupService)(userId, wallet_topup);
        res.status(200).json({ msg: "User updated successfully", data: result });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR, ErrorMessage_1.RESPONSE_STATUS.INTERNAL_SERVER_ERROR));
    }
});
