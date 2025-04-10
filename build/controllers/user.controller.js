"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteUserController = exports.updateUserController = exports.readUserController = exports.getAllUserController = exports.createUserController = void 0;
const catchAsyncError_1 = require("../utils/catchAsyncError");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const validate_1 = require("../utils/validate");
const user_service_1 = require("../services/user.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ErrorMessage_1 = require("../constants/ErrorMessage");
exports.createUserController = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    const { name, email, phoneNumber } = req.body;
    if (!name || !email || !phoneNumber) {
        throw new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.MISSING_REQUIRED_FIELD, ErrorMessage_1.RESPONSE_STATUS.MISSING_REQUIRED_FIELD);
    }
    try {
        const isEmailValid = (0, validate_1.validateEmail)(email);
        if (!isEmailValid) {
            return next(new ErrorHandler_1.default("Invalid email", 400));
        }
        const isPhoneNumberValid = (0, validate_1.validatePhoneNumber)(phoneNumber);
        if (!isPhoneNumberValid) {
            return next(new ErrorHandler_1.default("Invalid phone number", 400));
        }
        const isAlreadyEmail = await (0, user_service_1.getUserByEmailService)(email);
        if (isAlreadyEmail) {
            return next(new ErrorHandler_1.default("Email Already Exit", 401));
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(phoneNumber, salt);
        const user = {
            name,
            email,
            phoneNumber,
            password: hashedPassword,
        };
        const result = await (0, user_service_1.createUserService)(user);
        res.status(201).json({ msg: "User created successfully", data: result });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR, ErrorMessage_1.RESPONSE_STATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.getAllUserController = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const result = await (0, user_service_1.getAllUsersService)();
        res
            .status(200)
            .json({ msg: "All users fetched successfully", data: result });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR, ErrorMessage_1.RESPONSE_STATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.readUserController = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.MISSING_REQUIRED_FIELD, ErrorMessage_1.RESPONSE_STATUS.MISSING_REQUIRED_FIELD));
    }
    try {
        const result = await (0, user_service_1.readUserByIdService)(id);
        if (!result) {
            return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.USER_NOT_FOUND, ErrorMessage_1.RESPONSE_STATUS.DATA_NOT_FOUND));
        }
        res.status(200).json({ msg: "User fetched successfully", data: result });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR, ErrorMessage_1.RESPONSE_STATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.updateUserController = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    const { id } = req.params;
    const { name, phoneNumber } = req.body;
    if (!id || !name || !phoneNumber) {
        return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.MISSING_REQUIRED_FIELD, ErrorMessage_1.RESPONSE_STATUS.MISSING_REQUIRED_FIELD));
    }
    try {
        const isCheckUser = await (0, user_service_1.readUserByIdService)(id);
        if (!isCheckUser) {
            return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.USER_NOT_FOUND, ErrorMessage_1.RESPONSE_STATUS.DATA_NOT_FOUND));
        }
        if (!name || !phoneNumber) {
            throw new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.MISSING_REQUIRED_FIELD, ErrorMessage_1.RESPONSE_STATUS.MISSING_REQUIRED_FIELD);
        }
        const isPhoneNumberValid = (0, validate_1.validatePhoneNumber)(phoneNumber);
        if (!isPhoneNumberValid) {
            return next(new ErrorHandler_1.default("Invalid phone number", 400));
        }
        const user = {
            name,
            phoneNumber,
        };
        const result = await (0, user_service_1.updateUserService)(id, user);
        res.status(200).json({ msg: "User updated successfully", data: result });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR, ErrorMessage_1.RESPONSE_STATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.softDeleteUserController = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.MISSING_REQUIRED_FIELD, ErrorMessage_1.RESPONSE_STATUS.MISSING_REQUIRED_FIELD));
    }
    try {
        const isCheckUser = await (0, user_service_1.readUserByIdService)(id);
        if (!isCheckUser) {
            return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.USER_NOT_FOUND, ErrorMessage_1.RESPONSE_STATUS.DATA_NOT_FOUND));
        }
        if (isCheckUser.deleted) {
            return next(new ErrorHandler_1.default("User already deleted", 401));
        }
        const result = await (0, user_service_1.softDeleteService)(id);
        res.status(200).json({ msg: "User deleted successfully", data: result });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR, ErrorMessage_1.RESPONSE_STATUS.INTERNAL_SERVER_ERROR));
    }
});
