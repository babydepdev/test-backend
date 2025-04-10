import { CatchAsyncError } from "../utils/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import { getProductById } from "../services/product.service";
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
        return next(new ErrorHandler("User not found", 404));
      }

      const product = await getProductById(productId);

      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
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
      return next(new ErrorHandler("Internal server error", 500));
    }
  }
);
