import { Router } from "express";
import { updateWarehouse } from "../controllers/warehouseController";

export const warehouseController = Router();

warehouseController.post('/warehouse/update', updateWarehouse);