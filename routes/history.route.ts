import { Router } from "express";
import {
  getAllOrderHistoryController,
  readOrderHistoryByIdController,
} from "../controllers/history.controller";
const historyRoutes = Router();

historyRoutes.get("/historys", getAllOrderHistoryController);
historyRoutes.get("/history/:userId", readOrderHistoryByIdController);

export default historyRoutes;
