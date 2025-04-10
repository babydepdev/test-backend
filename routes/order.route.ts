import { Router } from "express";
import { createOrderController } from "../controllers/order.controller";
const orderRoutes = Router();

orderRoutes.post("/order", createOrderController);

export default orderRoutes;
