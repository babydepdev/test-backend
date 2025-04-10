import { createTransactionService } from "../services/transaction.service";
import { CatchAsyncError } from "../utils/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import prisma from "../prisma/prisma";
import { DataWithMonth, Transaction } from "../types/transaction.type";
import { months } from "../constants/Month";
import { RESPONSE_MESSAGE, RESPONSE_STATUS } from "../constants/ErrorMessage";

export const createTransactionController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, type, amount } = req.body;

    if (!name || !type || !amount) {
      return next(
        new ErrorHandler(
          RESPONSE_MESSAGE.MISSING_REQUIRED_FIELD,
          RESPONSE_STATUS.MISSING_REQUIRED_FIELD
        )
      );
    }

    if (type !== "Income" && type !== "Expense") {
      return next(new ErrorHandler("Invalid transaction type", 400));
    }

    try {
      const transaction = await createTransactionService({
        name,
        type,
        amount,
      });
      res.status(201).json(transaction);
    } catch (error) {
      console.log(error);
      return next(
        new ErrorHandler(
          RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
          RESPONSE_STATUS.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
);

export const filterTransactionController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const type = (req.query.type as string) || "All";

    const currentYear = new Date().getFullYear();

    const dateStart =
      (req.query.dateStart as string) ||
      new Date(`${currentYear}-01-01T00:00:00.000Z`).toISOString();

    const dateEnd =
      (req.query.dateEnd as string) ||
      new Date(`${currentYear}-12-31T23:59:59.999Z`).toISOString();

    if (!type) {
      return next(new ErrorHandler("Missing required fields", 400));
    }

    if (type !== "Income" && type !== "Expense" && type !== "All") {
      return next(new ErrorHandler("Invalid transaction type", 400));
    }

    const filters: any = {};

    if (type !== "All") {
      filters.type = type;
    }

    if (dateStart) {
      filters.createdAt = {
        gte: new Date(dateStart as string),
      };
    }

    if (dateEnd) {
      filters.createdAt = {
        ...filters.createdAt,
        lte: new Date(dateEnd as string),
      };
    }

    try {
      const transactions = await prisma.transaction.findMany({
        where: filters,
        orderBy: {
          createdAt: "desc",
        },
      });

      const totalIncome = transactions
        .filter((transaction: Transaction) => transaction.type === "Income")
        .reduce(
          (total: number, transaction: Transaction) =>
            total + transaction.amount,
          0
        );

      const totalExpense = transactions
        .filter((transaction: Transaction) => transaction.type === "Expense")
        .reduce(
          (total: number, transaction: Transaction) =>
            total + transaction.amount,
          0
        );

      const total = totalIncome - totalExpense;

      res.status(200).json({
        transactions,
        totalIncome,
        totalExpense,
        total,
      });
    } catch (error) {
      console.log(error);
      return next(
        new ErrorHandler(
          RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
          RESPONSE_STATUS.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
);

export const dashboardTransactionController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentYear = new Date().getFullYear();
      const previousYear = currentYear - 1;

      const currentYearTransactions = await prisma.transaction.findMany({
        where: {
          createdAt: {
            gte: new Date(`${currentYear}-01-01T00:00:00Z`),
            lte: new Date(`${currentYear}-12-31T23:59:59Z`),
          },
        },
      });

      const previousYearTransactions = await prisma.transaction.findMany({
        where: {
          createdAt: {
            gte: new Date(`${previousYear}-01-01T00:00:00Z`),
            lte: new Date(`${previousYear}-12-31T23:59:59Z`),
          },
        },
      });

      const monthlyDataCurrentYear = months.map((month, index) => {
        const income = currentYearTransactions
          .filter(
            (transaction: Transaction) =>
              new Date(transaction.createdAt).getMonth() === index &&
              transaction.type === "Income"
          )
          .reduce(
            (sum: number, transaction: Transaction) => sum + transaction.amount,
            0
          );

        const expense = currentYearTransactions
          .filter(
            (transaction: Transaction) =>
              new Date(transaction.createdAt).getMonth() === index &&
              transaction.type === "Expense"
          )
          .reduce(
            (sum: number, transaction: Transaction) => sum + transaction.amount,
            0
          );

        return { month, income, expense };
      });

      const monthlyDataPreviousYear = months.map((month, index) => {
        const income = previousYearTransactions
          .filter(
            (transaction: Transaction) =>
              new Date(transaction.createdAt).getMonth() === index &&
              transaction.type === "Income"
          )
          .reduce(
            (sum: number, transaction: Transaction) => sum + transaction.amount,
            0
          );

        const expense = previousYearTransactions
          .filter(
            (transaction: Transaction) =>
              new Date(transaction.createdAt).getMonth() === index &&
              transaction.type === "Expense"
          )
          .reduce(
            (sum: number, transaction: Transaction) => sum + transaction.amount,
            0
          );

        return { month, income, expense };
      });

      const totalIncomeCurrentYear = monthlyDataCurrentYear.reduce(
        (sum: number, data: DataWithMonth) => sum + data.income,
        0
      );
      const totalExpenseCurrentYear = monthlyDataCurrentYear.reduce(
        (sum: number, data: DataWithMonth) => sum + data.expense,
        0
      );

      const totalIncomePreviousYear = monthlyDataPreviousYear.reduce(
        (sum: number, data: DataWithMonth) => sum + data.income,
        0
      );
      
      const totalExpensePreviousYear = monthlyDataPreviousYear.reduce(
        (sum: number, data: DataWithMonth) => sum + data.expense,
        0
      );

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
    } catch (error) {
      console.log(error);
      return next(
        new ErrorHandler(
          RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
          RESPONSE_STATUS.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
);
