import { Router } from "express";
import { addOrder, getOrder, getOrders } from "../controllers/orderController";

export const orderRouter = Router();

orderRouter.post('/orders/add', addOrder);
orderRouter.get('/orders/:id', getOrder);
orderRouter.get('/orders', getOrders);