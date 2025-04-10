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
      const results = await getAllOrderHistoryService();

      if (results) {
        return next(
          new ErrorHandler(
            RESPONSE_MESSAGE.ORDER_NOT_FOUND,
            RESPONSE_STATUS.DATA_NOT_FOUND
          )
        );
      }

      res.status(200).json({
        msg: "All order history fetched successfully",
        data: results,
      });
    } catch (error) {
      return next(
        new ErrorHandler(
          RESPONSE_MESSAGE.INTERNAL_SERVER_ERROR,
          RESPONSE_STATUS.INTERNAL_SERVER_ERROR
        )
      );
    }
  }
);

export const readOrderHistoryByIdController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const result = await readOrderHistoryService(userId);

      if (!result) {
        return next(
          new ErrorHandler(
            RESPONSE_MESSAGE.ORDER_NOT_FOUND,
            RESPONSE_STATUS.DATA_NOT_FOUND
          )
        );
      }

      res
        .status(200)
        .json({ msg: "Order history fetched successfully", data: result });
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
