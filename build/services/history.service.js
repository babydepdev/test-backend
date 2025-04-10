"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readOrderHistoryService = exports.getAllOrderHistoryService = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const getAllOrderHistoryService = async () => {
    const result = await prisma_1.default.order.findMany();
    return result;
};
exports.getAllOrderHistoryService = getAllOrderHistoryService;
const readOrderHistoryService = async (userId) => {
    const result = await prisma_1.default.order.findMany({
        where: {
            userId,
        },
    });
    return result;
};
exports.readOrderHistoryService = readOrderHistoryService;
