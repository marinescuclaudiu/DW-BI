import { Router } from "express";
import { getDiscount, getDiscounts, updateDiscount, deleteDiscount, addDiscount } from "../controllers/discountController";

export const discountRouter = Router();

discountRouter.post('/discounts/add', addDiscount);
discountRouter.get('/discounts/:id', getDiscount);
discountRouter.get('/discounts', getDiscounts);
discountRouter.put('/discounts/:id', updateDiscount);
discountRouter.delete('/discounts/:id', deleteDiscount);