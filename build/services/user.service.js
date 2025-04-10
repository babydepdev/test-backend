"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deductWalletService = exports.getAllUsersService = exports.softDeleteService = exports.deleteUserService = exports.updateUserService = exports.getUserByEmailService = exports.readUserByIdService = exports.createUserService = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const createUserService = async (user) => {
    const result = await prisma_1.default.user.create({
        data: user,
    });
    return result;
};
exports.createUserService = createUserService;
const readUserByIdService = async (id) => {
    const result = await prisma_1.default.user.findUnique({
        where: {
            id,
            deleted: false,
        },
    });
    return result;
};
exports.readUserByIdService = readUserByIdService;
const getUserByEmailService = async (email) => {
    const result = await prisma_1.default.user.findFirst({
        where: {
            email,
            deleted: false,
        },
    });
    return result;
};
exports.getUserByEmailService = getUserByEmailService;
const updateUserService = async (id, user) => {
    const result = await prisma_1.default.user.update({
        where: {
            id,
            deleted: false,
        },
        data: user,
    });
    return result;
};
exports.updateUserService = updateUserService;
const deleteUserService = async (id) => {
    const result = await prisma_1.default.user.delete({
        where: {
            id,
        },
    });
    return result;
};
exports.deleteUserService = deleteUserService;
const softDeleteService = async (id) => {
    const result = await prisma_1.default.user.update({
        where: {
            id,
        },
        data: {
            deleted: true,
        },
    });
    return result;
};
exports.softDeleteService = softDeleteService;
const getAllUsersService = async () => {
    const result = await prisma_1.default.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            rate_discount: true,
            wallet: true,
            createdAt: true,
            updatedAt: true,
        },
        where: {
            deleted: false,
        },
    });
    return result;
};
exports.getAllUsersService = getAllUsersService;
const deductWalletService = async (user, order) => {
    const result = await prisma_1.default.user.update({
        where: {
            id: user.id,
        },
        data: {
            wallet: user.wallet - order.total,
        },
    });
    return result;
};
exports.deductWalletService = deductWalletService;
