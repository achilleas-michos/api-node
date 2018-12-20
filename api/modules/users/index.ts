import express from "express";
import {addSchema, validateSchema} from "../../common/parameter-validator";
import * as userSchema from "./schema.json";
import { addOne, count, deleteOne, edit, get } from "./users.controller";
const usersRouter = express.Router();

addSchema(userSchema, "user");

usersRouter.get("/user/", get);
usersRouter.get("/user/:id", get);
usersRouter.get("/user/count", count);
usersRouter.put("/user/",  validateSchema("user"), addOne);
usersRouter.delete("/user/:id", deleteOne);
usersRouter.post("/user/:id",  validateSchema("user"), edit);

export { usersRouter };
