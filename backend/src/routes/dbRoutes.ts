import { Router } from "express";
import { insertPerson, updatePerson, getPerson, deletePerson } from "../controllers/dbController";

export const router = Router();

router.post('/person/add', insertPerson);
router.put('/person/:id', updatePerson);
router.get('/person/:id', getPerson);
router.delete('/person/:id', deletePerson);