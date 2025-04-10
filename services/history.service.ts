import prisma from "../prisma/prisma";

export const getAllOrderHistoryService = async () => {
  const result = await prisma.order.findMany();

  return result;
};

export const readOrderHistoryService = async (userId: string) => {
  const result = await prisma.order.findMany({
    where: {
      userId,
    },
  });
  return result;
};
