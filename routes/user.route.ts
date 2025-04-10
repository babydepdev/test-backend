import express from "express";
import {
  createUserController,
  getAllUserController,
  readUserController,
  softDeleteUserController,
  updateUserController,
} from "../controllers/user.controller";
const userRouter = express.Router();

userRouter.post("/user", createUserController);
userRouter.get("/user", getAllUserController);
userRouter.get("/user/:id", readUserController);
userRouter.put("/user/:id", updateUserController);
userRouter.delete("/user/:id", softDeleteUserController);

export default userRouter;
