"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = require("../controllers/transaction.controller");
const transactionRouter = (0, express_1.Router)();
transactionRouter.post("/transaction", transaction_controller_1.createTransactionController);
transactionRouter.get("/transactions", transaction_controller_1.filterTransactionController);
transactionRouter.get("/transaction/dashboard", transaction_controller_1.dashboardTransactionController);
exports.default = transactionRouter;
