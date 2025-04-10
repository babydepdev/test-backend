import prisma from "../prisma/prisma";
import { OrderCreateParams } from "../types/order.type";

export const createOrderService = async (order: OrderCreateParams) => {
  const result = await prisma.order.create({
    data: order,
  });

  return result;
};
