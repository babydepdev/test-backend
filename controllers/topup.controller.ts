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
        return next(new ErrorHandler("User not found", 404));
      }

      const result = await topupService(userId, wallet_topup);
      res.status(200).json({ msg: "User updated successfully", data: result });
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler("Internal server error", 500));
    }
  }
);
