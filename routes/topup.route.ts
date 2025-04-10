import { Router } from "express";
import { topupController } from "../controllers/topup.controller";
const topupRoutes = Router();

topupRoutes.post("/topup/:userId", topupController);

export default topupRoutes;
