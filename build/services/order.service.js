"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderService = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const createOrderService = async (order) => {
    const result = await prisma_1.default.order.create({
        data: order,
    });
    return result;
};
exports.createOrderService = createOrderService;
