import prisma from "../prisma/prisma";

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id: id,
    },
  });

  return product;
};
