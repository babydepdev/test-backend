"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderController = void 0;
const catchAsyncError_1 = require("../utils/catchAsyncError");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const product_service_1 = require("../services/product.service");
const user_service_1 = require("../services/user.service");
const order_service_1 = require("../services/order.service");
const ErrorMessage_1 = require("../constants/ErrorMessage");
exports.createOrderController = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
        return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.MISSING_REQUIRED_FIELD, ErrorMessage_1.RESPONSE_STATUS.MISSING_REQUIRED_FIELD));
    }
    try {
        const user = await (0, user_service_1.readUserByIdService)(userId);
        if (!user) {
            return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.USER_NOT_FOUND, ErrorMessage_1.RESPONSE_STATUS.DATA_NOT_FOUND));
        }
        const product = await (0, product_service_1.getProductByIdService)(productId);
        if (!product) {
            return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.PRODUCT_NOT_FOUND, ErrorMessage_1.RESPONSE_STATUS.DATA_NOT_FOUND));
        }
        const order = {
            userId: userId,
            productId: productId,
            price: product.price,
            discount_price: product.price * (user.rate_discount / 100),
            discount_rate: user.rate_discount,
            total: product.price - product.price * (user.rate_discount / 100),
        };
        if (user.wallet < order.total) {
            return next(new ErrorHandler_1.default("Insufficient balance", 400));
        }
        await (0, user_service_1.deductWalletService)(user, order);
        const result = await (0, order_service_1.createOrderService)(order);
        res.status(201).json({ result });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR, ErrorMessage_1.RESPONSE_STATUS.INTERNAL_SERVER_ERROR));
    }
});
