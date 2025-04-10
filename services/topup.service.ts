import prisma from "../prisma/prisma";

export const topupService = async (id: string, wallet_topup: number) => {
  const result = await prisma.topup.create({
    data: {
      userId: id,
      wallet_topup: wallet_topup,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (user) {
    user.wallet += wallet_topup;
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        wallet: user.wallet,
      },
    });
  }
  return result;
};
