"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const history_controller_1 = require("../controllers/history.controller");
const historyRoutes = (0, express_1.Router)();
historyRoutes.get("/historys", history_controller_1.getAllOrderHistoryController);
historyRoutes.get("/history/:userId", history_controller_1.readOrderHistoryByIdController);
exports.default = historyRoutes;
