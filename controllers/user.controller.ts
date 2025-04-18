import { CatchAsyncError } from "../utils/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import { validateEmail, validatePhoneNumber } from "../utils/validate";
import {
  createUserService,
  getAllUsersService,
  getUserByEmailService,
  readUserByIdService,
  softDeleteService,
  updateUserService,
} from "../services/user.service";
import bcrypt from "bcryptjs";
import { UserCreateParams } from "../types/user.type";
import { RESPONSE_MESSAGE, RESPONSE_STATUS } from "../constants/ErrorMessage";

export const createUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phoneNumber } = req.body;

    if (!name || !email || !phoneNumber) {
      throw new ErrorHandler(
        RESPONSE_MESSAGE.MISSING_REQUIRED_FIELD,
        RESPONSE_STATUS.MISSING_REQUIRED_FIELD
      );
    }

    try {
      const isEmailValid = validateEmail(email);

      if (!isEmailValid) {
        return next(new ErrorHandler("Invalid email", 400));
      }
      const isPhoneNumberValid = validatePhoneNumber(phoneNumber);

      if (!isPhoneNumberValid) {
        return next(new ErrorHandler("Invalid phone number", 400));
      }

      const isAlreadyEmail = await getUserByEmailService(email);

      if (isAlreadyEmail) {
        return next(new ErrorHandler("Email Already Exit", 401));
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(phoneNumber, salt);

      const user: UserCreateParams = {
        name,
        email,
        phoneNumber,
        password: hashedPassword,
      };

      const result = await createUserService(user);
      res.status(201).json({ msg: "User created successfully", data: result });
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

export const getAllUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getAllUsersService();
      res
        .status(200)
        .json({ msg: "All users fetched successfully", data: result });
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

export const readUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(
        new ErrorHandler(
          RESPONSE_MESSAGE.MISSING_REQUIRED_FIELD,
          RESPONSE_STATUS.MISSING_REQUIRED_FIELD
        )
      );
    }

    try {
      const result = await readUserByIdService(id);
      if (!result) {
        return next(
          new ErrorHandler(
            RESPONSE_MESSAGE.USER_NOT_FOUND,
            RESPONSE_STATUS.DATA_NOT_FOUND
          )
        );
      }
      res.status(200).json({ msg: "User fetched successfully", data: result });
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

export const updateUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, phoneNumber } = req.body;

    if (!id || !name || !phoneNumber) {
      return next(
        new ErrorHandler(
          RESPONSE_MESSAGE.MISSING_REQUIRED_FIELD,
          RESPONSE_STATUS.MISSING_REQUIRED_FIELD
        )
      );
    }

    try {
      const isCheckUser = await readUserByIdService(id);

      if (!isCheckUser) {
        return next(
          new ErrorHandler(
            RESPONSE_MESSAGE.USER_NOT_FOUND,
            RESPONSE_STATUS.DATA_NOT_FOUND
          )
        );
      }

      if (!name || !phoneNumber) {
        throw new ErrorHandler(
          RESPONSE_MESSAGE.MISSING_REQUIRED_FIELD,
          RESPONSE_STATUS.MISSING_REQUIRED_FIELD
        );
      }

      const isPhoneNumberValid = validatePhoneNumber(phoneNumber);

      if (!isPhoneNumberValid) {
        return next(new ErrorHandler("Invalid phone number", 400));
      }

      const user = {
        name,
        phoneNumber,
      };

      const result = await updateUserService(id, user);
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

export const softDeleteUserController = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      return next(
        new ErrorHandler(
          RESPONSE_MESSAGE.MISSING_REQUIRED_FIELD,
          RESPONSE_STATUS.MISSING_REQUIRED_FIELD
        )
      );
    }

    try {
      const isCheckUser = await readUserByIdService(id);

      if (!isCheckUser) {
        return next(
          new ErrorHandler(
            RESPONSE_MESSAGE.USER_NOT_FOUND,
            RESPONSE_STATUS.DATA_NOT_FOUND
          )
        );
      }

      if (isCheckUser.deleted) {
        return next(new ErrorHandler("User already deleted", 401));
      }

      const result = await softDeleteService(id);
      res.status(200).json({ msg: "User deleted successfully", data: result });
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
