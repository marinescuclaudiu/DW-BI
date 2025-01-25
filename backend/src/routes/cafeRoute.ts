import { Router } from "express";
import { getCafe, getCafes, updateCafe, deleteCafe, addCafe } from "../controllers/cafeController";

export const cafeRouter = Router();

cafeRouter.post('/cafes/add', addCafe);
cafeRouter.get('/cafes/:id', getCafe);
cafeRouter.get('/cafes', getCafes);
cafeRouter.put('/cafes/:id', updateCafe);
cafeRouter.delete('/cafes/:id', deleteCafe);