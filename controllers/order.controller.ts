import { CatchAsyncError } from "../utils/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import { getProductByIdService } from "../services/product.service";
import {
  deductWalletService,
  readUserByIdService,
} from "../services/user.service";
import { createOrderService } from "../services/order.service";
import { OrderCreateParams } from "../types/order.type";

export const createOrderController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return next(new ErrorHandler("Missing required fields", 400));
    }

    try {
      const user = await readUserByIdService(userId);

      if (!user) {
        return next(
          new ErrorHandler(
            RESPONSE_MESSAGE.USER_NOT_FOUND,
            RESPONSE_STATUS.DATA_NOT_FOUND
          )
        );
      }

      const product = await getProductByIdService(productId);

      if (!product) {
        return next(
          new ErrorHandler(
            RESPONSE_MESSAGE.PRODUCT_NOT_FOUND,
            RESPONSE_STATUS.DATA_NOT_FOUND
          )
        );
      }

      const order: OrderCreateParams = {
        userId: userId,
        productId: productId,
        price: product.price,
        discount_price: product.price * (user.rate_discount / 100),
        discount_rate: user.rate_discount,
        total: product.price - product.price * (user.rate_discount / 100),
      };

      if (user.wallet < order.total) {
        return next(new ErrorHandler("Insufficient balance", 400));
      }

      await deductWalletService(user, order);

      const result = await createOrderService(order);

      res.status(201).json({ result });
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
