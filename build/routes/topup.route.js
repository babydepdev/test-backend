"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const topup_controller_1 = require("../controllers/topup.controller");
const topupRoutes = (0, express_1.Router)();
topupRoutes.post("/topup/:userId", topup_controller_1.topupController);
exports.default = topupRoutes;
