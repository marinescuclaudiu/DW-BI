import { Router } from "express";
import { getSubcategory, getSubcategories, updateSubcategory, deleteSubcategory, addSubcategory } from "../controllers/subcategoryController";

export const subcategoryRouter = Router();

subcategoryRouter.post('/subcategories/add', addSubcategory);
subcategoryRouter.get('/subcategories/:id', getSubcategory);
subcategoryRouter.get('/subcategories', getSubcategories);
subcategoryRouter.put('/subcategories/:id', updateSubcategory);
subcategoryRouter.delete('/subcategories/:id', deleteSubcategory);