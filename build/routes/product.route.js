"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const productRoutes = (0, express_1.Router)();
productRoutes.get("/products", product_controller_1.getAllProductController);
exports.default = productRoutes;
