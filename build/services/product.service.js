"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProductService = exports.getProductByIdService = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const getProductByIdService = async (id) => {
    const product = await prisma_1.default.product.findUnique({
        where: {
            id,
        },
    });
    return product;
};
exports.getProductByIdService = getProductByIdService;
const getAllProductService = async () => {
    const result = await prisma_1.default.product.findMany({
        select: {
            id: true,
            name: true,
            price: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return result;
};
exports.getAllProductService = getAllProductService;
