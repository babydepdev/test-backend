"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardTransactionController = exports.filterTransactionController = exports.createTransactionController = void 0;
const transaction_service_1 = require("../services/transaction.service");
const catchAsyncError_1 = require("../utils/catchAsyncError");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const prisma_1 = __importDefault(require("../prisma/prisma"));
const Month_1 = require("../constants/Month");
const ErrorMessage_1 = require("../constants/ErrorMessage");
exports.createTransactionController = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    const { name, type, amount } = req.body;
    if (!name || !type || !amount) {
        return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.MISSING_REQUIRED_FIELD, ErrorMessage_1.RESPONSE_STATUS.MISSING_REQUIRED_FIELD));
    }
    if (type !== "Income" && type !== "Expense") {
        return next(new ErrorHandler_1.default("Invalid transaction type", 400));
    }
    try {
        const transaction = await (0, transaction_service_1.createTransactionService)({
            name,
            type,
            amount,
        });
        res.status(201).json(transaction);
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR, ErrorMessage_1.RESPONSE_STATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.filterTransactionController = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    const type = req.query.type || "All";
    const currentYear = new Date().getFullYear();
    const dateStart = req.query.dateStart ||
        new Date(`${currentYear}-01-01T00:00:00.000Z`).toISOString();
    const dateEnd = req.query.dateEnd ||
        new Date(`${currentYear}-12-31T23:59:59.999Z`).toISOString();
    if (!type) {
        return next(new ErrorHandler_1.default("Missing required fields", 400));
    }
    if (type !== "Income" && type !== "Expense" && type !== "All") {
        return next(new ErrorHandler_1.default("Invalid transaction type", 400));
    }
    const filters = {};
    if (type !== "All") {
        filters.type = type;
    }
    if (dateStart) {
        filters.createdAt = {
            gte: new Date(dateStart),
        };
    }
    if (dateEnd) {
        filters.createdAt = {
            ...filters.createdAt,
            lte: new Date(dateEnd),
        };
    }
    try {
        const transactions = await prisma_1.default.transaction.findMany({
            where: filters,
            orderBy: {
                createdAt: "desc",
            },
        });
        const totalIncome = transactions
            .filter((transaction) => transaction.type === "Income")
            .reduce((total, transaction) => total + transaction.amount, 0);
        const totalExpense = transactions
            .filter((transaction) => transaction.type === "Expense")
            .reduce((total, transaction) => total + transaction.amount, 0);
        const total = totalIncome - totalExpense;
        res.status(200).json({
            transactions,
            totalIncome,
            totalExpense,
            total,
        });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR, ErrorMessage_1.RESPONSE_STATUS.INTERNAL_SERVER_ERROR));
    }
});
exports.dashboardTransactionController = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const currentYear = new Date().getFullYear();
        const previousYear = currentYear - 1;
        const currentYearTransactions = await prisma_1.default.transaction.findMany({
            where: {
                createdAt: {
                    gte: new Date(`${currentYear}-01-01T00:00:00Z`),
                    lte: new Date(`${currentYear}-12-31T23:59:59Z`),
                },
            },
        });
        const previousYearTransactions = await prisma_1.default.transaction.findMany({
            where: {
                createdAt: {
                    gte: new Date(`${previousYear}-01-01T00:00:00Z`),
                    lte: new Date(`${previousYear}-12-31T23:59:59Z`),
                },
            },
        });
        const monthlyDataCurrentYear = Month_1.months.map((month, index) => {
            const income = currentYearTransactions
                .filter((transaction) => new Date(transaction.createdAt).getMonth() === index &&
                transaction.type === "Income")
                .reduce((sum, transaction) => sum + transaction.amount, 0);
            const expense = currentYearTransactions
                .filter((transaction) => new Date(transaction.createdAt).getMonth() === index &&
                transaction.type === "Expense")
                .reduce((sum, transaction) => sum + transaction.amount, 0);
            return { month, income, expense };
        });
        const monthlyDataPreviousYear = Month_1.months.map((month, index) => {
            const income = previousYearTransactions
                .filter((transaction) => new Date(transaction.createdAt).getMonth() === index &&
                transaction.type === "Income")
                .reduce((sum, transaction) => sum + transaction.amount, 0);
            const expense = previousYearTransactions
                .filter((transaction) => new Date(transaction.createdAt).getMonth() === index &&
                transaction.type === "Expense")
                .reduce((sum, transaction) => sum + transaction.amount, 0);
            return { month, income, expense };
        });
        const totalIncomeCurrentYear = monthlyDataCurrentYear.reduce((sum, data) => sum + data.income, 0);
        const totalExpenseCurrentYear = monthlyDataCurrentYear.reduce((sum, data) => sum + data.expense, 0);
        const totalIncomePreviousYear = monthlyDataPreviousYear.reduce((sum, data) => sum + data.income, 0);
        const totalExpensePreviousYear = monthlyDataPreviousYear.reduce((sum, data) => sum + data.expense, 0);
        const incomeGrowth = totalIncomePreviousYear
            ? ((totalIncomeCurrentYear - totalIncomePreviousYear) /
                totalIncomePreviousYear) *
                100
            : 0;
        const expenseGrowth = totalExpensePreviousYear
            ? ((totalExpenseCurrentYear - totalExpensePreviousYear) /
                totalExpensePreviousYear) *
                100
            : 0;
        const totalCurrent = totalIncomeCurrentYear - totalExpenseCurrentYear;
        const totalPrev = totalIncomePreviousYear - totalExpensePreviousYear;
        res.status(200).json({
            monthlyDataCurrentYear,
            monthlyDataPreviousYear,
            totalIncomeCurrentYear,
            totalExpenseCurrentYear,
            incomeGrowth,
            expenseGrowth,
            totalCurrent,
            totalPrev,
        });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(ErrorMessage_1.RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR, ErrorMessage_1.RESPONSE_STATUS.INTERNAL_SERVER_ERROR));
    }
});
