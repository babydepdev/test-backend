import prisma from "../prisma/prisma";
import { TransactionCreateParams } from "../types/transaction.type";

export const createTransactionService = async (transaction: TransactionCreateParams) => {
  const result = await prisma.transaction.create({
    data: transaction,
  });
  return result;
};
