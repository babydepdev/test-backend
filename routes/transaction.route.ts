import { Router } from "express";
import {
  createTransactionController,
  dashboardTransactionController,
  filterTransactionController,
} from "../controllers/transaction.controller";

const transactionRouter = Router();

transactionRouter.post("/transaction", createTransactionController);
transactionRouter.get("/transaction", filterTransactionController);
transactionRouter.get("/transaction/dashboard", dashboardTransactionController);

export default transactionRouter;
