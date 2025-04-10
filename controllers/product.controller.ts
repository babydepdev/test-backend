import { getAllProductService } from "../services/product.service";
import { CatchAsyncError } from "../utils/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";

export const getAllProductController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAllProductService();
      res
        .status(200)
        .json({ msg: "All product fetched successfully", data: result });
    } catch (error) {
      console.log(error);
      return next(new ErrorHandler("Internal server error", 500));
    }
  }
);
