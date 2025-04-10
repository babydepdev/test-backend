import {
  getAllOrderHistoryService,
  readOrderHistoryService,
} from "../services/history.service";
import { CatchAsyncError } from "../utils/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";

export const getAllOrderHistoryController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAllOrderHistoryService();
      res
        .status(200)
        .json({ msg: "All order history fetched successfully", data: result });
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler("Internal server error", 500));
    }
  }
);

export const readOrderHistoryByIdController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const result = await readOrderHistoryService(userId);
      res
        .status(200)
        .json({ msg: "Order history fetched successfully", data: result });
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler("Internal server error", 500));
    }
  }
);
