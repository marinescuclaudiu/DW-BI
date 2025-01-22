import { Router } from "express";
import { getUser, getUsers, updateUser, deleteUser, loginUser } from "../controllers/userController";

export const userRouter = Router();

userRouter.post('/login', loginUser);
userRouter.get('/users/:id', getUser);
userRouter.get('/users', getUsers);
userRouter.put('/users/:id', updateUser);
userRouter.delete('/users/:id', deleteUser);
