"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const orderRoutes = (0, express_1.Router)();
orderRoutes.post("/order", order_controller_1.createOrderController);
exports.default = orderRoutes;
