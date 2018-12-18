import express from "express";
import { getData } from "./datagrid.controller";

const datagridRouter = express.Router();

datagridRouter.get("/datagrid/", getData);

export { datagridRouter };
