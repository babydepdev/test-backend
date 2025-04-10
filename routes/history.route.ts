import { Router } from "express";
import {
  getAllOrderHistoryController,
  readOrderHistoryByIdController,
} from "../controllers/history.controller";
const historyRoutes = Router();

historyRoutes.get("/history", getAllOrderHistoryController);
historyRoutes.get("/history/:userId", readOrderHistoryByIdController);

export default historyRoutes;
