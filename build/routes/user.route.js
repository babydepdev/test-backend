"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const userRouter = express_1.default.Router();
userRouter.post("/user", user_controller_1.createUserController);
userRouter.get("/users", user_controller_1.getAllUserController);
userRouter.get("/user/:id", user_controller_1.readUserController);
userRouter.put("/user/:id", user_controller_1.updateUserController);
userRouter.delete("/user/:id", user_controller_1.softDeleteUserController);
exports.default = userRouter;
