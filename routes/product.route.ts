import { Router } from "express";
import { getAllProductController } from "../controllers/product.controller";
const productRoutes = Router();

productRoutes.get("/products", getAllProductController);

export default productRoutes;
