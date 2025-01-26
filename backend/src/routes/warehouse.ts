import { Router } from "express";
import { updateWarehouse, getTopCities } from "../controllers/warehouseController";

export const warehouseController = Router();

warehouseController.post('/warehouse/update', updateWarehouse);
warehouseController.get('/warehouse/topCities', getTopCities);