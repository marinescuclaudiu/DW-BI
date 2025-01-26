import { Router } from "express";
import { updateWarehouse, getTopCities, getTopSubcategories, getTopProductSales } from "../controllers/warehouseController";

export const warehouseController = Router();

warehouseController.post('/warehouse/update', updateWarehouse);
warehouseController.get('/warehouse/topCities', getTopCities);
warehouseController.get('/warehouse/topSubcategories', getTopSubcategories);
warehouseController.get('/warehouse/topProductSales', getTopProductSales);