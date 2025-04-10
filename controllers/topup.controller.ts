import { CatchAsyncError } from "../utils/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import { readUserByIdService } from "../services/user.service";
import { topupService } from "../services/topup.service";

export const topupController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { wallet_topup } = req.body;
    try {
      const isCheckUser = await readUserByIdService(userId);

      if (!isCheckUser) {
        return next(
          new ErrorHandler(
            RESPONSE_MESSAGE.USER_NOT_FOUND,
            RESPONSE_STATUS.DATA_NOT_FOUND
          )
        );
      }

      const result = await topupService(userId, wallet_topup);
      res.status(200).json({ msg: "User updated successfully", data: result });
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
