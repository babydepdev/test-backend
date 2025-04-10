import prisma from "../prisma/prisma";

export const getProductByIdService = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  return product;
};

export const getAllProductService = async () => {
  const result = await prisma.product.findMany({
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
