import { Router } from "express";
import { getCategories, getCategory, updateCategory, deleteCategory } from "../controllers/categoryController";

export const categoryRouter = Router();

categoryRouter.get('/categories/:id', getCategory);
categoryRouter.get('/categories', getCategories);
categoryRouter.put('/categories/:id', updateCategory);
categoryRouter.delete('/categories/:id', deleteCategory);