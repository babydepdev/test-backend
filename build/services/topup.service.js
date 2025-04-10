"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.topupService = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const topupService = async (id, wallet_topup) => {
    const result = await prisma_1.default.topup.create({
        data: {
            userId: id,
            wallet_topup: wallet_topup,
        },
    });
    const user = await prisma_1.default.user.findUnique({
        where: {
            id,
        },
    });
    if (user) {
        user.wallet += wallet_topup;
        await prisma_1.default.user.update({
            where: {
                id,
            },
            data: {
                wallet: user.wallet,
            },
        });
    }
    return result;
};
exports.topupService = topupService;
