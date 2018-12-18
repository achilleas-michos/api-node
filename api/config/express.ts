import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./configuration";
import { loggerStream } from "./wiston-logger";

const configureExpress = (app: express.Application) => {
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: "25mb" }));

  if (config.env === "production") {
    app.use((req, res, next) => {
      // Website you wish to allow to connect
      res.setHeader("Access-Control-Allow-Origin", "*");
      // Request methods you wish to allow
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
      // Request headers you wish to allow
      res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-type, Authorization, " +
          "Cache-control, Pragma");
      // Pass to next layer of middleware
      next();
    });
    app.use(morgan("combined", { stream: loggerStream}));
    app.use(helmet());
  } else {
    // Add headers for CORS
    app.use((req, res, next) => {
      // Website you wish to allow to connect
      res.setHeader("Access-Control-Allow-Origin", "*");
      // Request methods you wish to allow
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
      // Request headers you wish to allow
      res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-type, Authorization, " +
          "Cache-control, Pragma");
      // Pass to next layer of middleware
      next();
    });
    app.use(morgan("dev", { stream: loggerStream}));
  }
};

export { configureExpress };
