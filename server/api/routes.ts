import express from "express";
import { datagridRouter } from "./datagrid/index";

const setupRoutes = (app: express.Application) => {
  app.use("/api/", datagridRouter);
};

export { setupRoutes };
