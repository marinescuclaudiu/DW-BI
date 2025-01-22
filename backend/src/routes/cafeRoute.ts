import { Router } from "express";
import { getCafe, getCafes, updateCafe, deleteCafe } from "../controllers/cafeController";

export const cafeRouter = Router();

cafeRouter.get('/cafes/:id', getCafe);
cafeRouter.get('/cafes', getCafes);
cafeRouter.put('/cafes/:id', updateCafe);
cafeRouter.delete('/cafes/:id', deleteCafe);