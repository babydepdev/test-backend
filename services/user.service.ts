import prisma from "../prisma/prisma";
import { UserCreateParams, UserUpdateParams } from "../types/user.type";

export const createUserService = async (user: UserCreateParams) => {
  const result = await prisma.user.create({
    data: user,
  });

  return result;
};

export const readUserByIdService = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
      deleted: false,
    },
  });

  return result;
};

export const getUserByEmailService = async (email: string) => {
  const result = await prisma.user.findFirst({
    where: {
      email,
      deleted: false,
    },
  });

  return result;
};

export const updateUserService = async (id: string, user: UserUpdateParams) => {
  const result = await prisma.user.update({
    where: {
      id,
      deleted: false,
    },
    data: user,
  });

  return result;
};

export const deleteUserService = async (id: string) => {
  const result = await prisma.user.delete({
    where: {
      id,
    },
  });

  return result;
};

export const softDeleteService = async (id: string) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      deleted: true,
    },
  });

  return result;
};

export const getAllUsersService = async () => {
  const result = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      rate_discount: true,
      wallet: true,
      createdAt: true,
      updatedAt: true,
    },
    where: {
      deleted: false,
    },
  });

  return result;
};

export const deductWalletService = async (user: any, order: any) => {
  const result = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      wallet: user.wallet - order.total,
    },
  });

  return result;
};
