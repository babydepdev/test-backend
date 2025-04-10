import { getAllProductService } from "../services/product.service";
import { CatchAsyncError } from "../utils/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";

export const getAllProductController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const results = await getAllProductService();

      if (results) {
        return next(
          new ErrorHandler(
            RESPONSE_MESSAGE.DATA_NOT_FOUND,
            RESPONSE_STATUS.DATA_NOT_FOUND
          )
        );
      }

      res
        .status(200)
        .json({ msg: "All product fetched successfully", data: results });
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
