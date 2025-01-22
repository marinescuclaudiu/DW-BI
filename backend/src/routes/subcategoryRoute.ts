import { Router } from "express";
import { getSubcategory, getSubcategories, updateSubcategory, deleteSubcategory } from "../controllers/subcategoryController";

export const subcategoryRouter = Router();

subcategoryRouter.get('/subcategories/:id', getSubcategory);
subcategoryRouter.get('/subcategories', getSubcategories);
subcategoryRouter.put('/subcategories/:id', updateSubcategory);
subcategoryRouter.delete('/subcategories/:id', deleteSubcategory);