import express from "express";
import { config } from "./config/configuration";
import { configureExpress } from "./config/express";
import { logger } from "./config/wiston-logger";
import { setupRoutes } from "./routes";

class App {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
    }

    private config(): void {
        configureExpress(this.app);
        setupRoutes(this.app);
    }

}

const app = new App().app;

app.listen(config.port, config.ip, () => {
    logger.info(`Express server listening on ${config.port}, in ${config.env} mode`);
});

export { app };
