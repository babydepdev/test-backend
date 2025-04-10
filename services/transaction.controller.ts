import prisma from "../prisma/prisma";

export const createTransactionService = async (transaction: any) => {
  const result = await prisma.transaction.create({
    data: transaction,
  });
  return result;
};
