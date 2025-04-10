import prisma from "../prisma/prisma";

export const createOrderService = async (order: any) => {
  const result = await prisma.order.create({
    data: order,
  });

  return result;
};
