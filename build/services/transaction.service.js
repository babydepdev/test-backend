"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionService = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
const createTransactionService = async (transaction) => {
    const result = await prisma_1.default.transaction.create({
        data: transaction,
    });
    return result;
};
exports.createTransactionService = createTransactionService;
