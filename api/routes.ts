import express from "express";
import swaggerUI from "swagger-ui-express";
import yaml from "yamljs";
import { datagridRouter } from "./datagrid/index";

const setupRoutes = (app: express.Application) => {
  app.use("/api/", datagridRouter);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(yaml.load("./api/swagger.yaml")));
};

export { setupRoutes };
