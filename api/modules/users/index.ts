import express from "express";
import { getUsers } from "./users.controller";

const usersRouter = express.Router();

usersRouter.get("/users/", getUsers);

export { usersRouter };
