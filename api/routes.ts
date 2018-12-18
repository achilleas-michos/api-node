import express from "express";
import fs from "fs";
import path from "path";
import swaggerUI from "swagger-ui-express";
import { config } from "./config/configuration";
import { interpolateSwaggerToJson, mergeSwaggerJson } from "./config/swagger";
import { logger } from "./config/wiston-logger";
import { usersRouter } from "./modules/users/index";

const setupRoutes = (app: express.Application) => {
  app.use("/api/", usersRouter);

  let swaggerFile = fs.readFileSync(path.join(config.root, "swagger.json"), "utf-8");

  swaggerFile = interpolateSwaggerToJson(swaggerFile, config);
  mergeSwaggerJson(JSON.stringify(swaggerFile)).then( (contents: any) => {
      app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(contents));
  }).catch((error) => {
      logger.error(`Loading swagger configuration: ${error}`);
  });
};

export { setupRoutes };
