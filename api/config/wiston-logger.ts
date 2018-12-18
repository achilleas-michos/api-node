import { createLogger, format, transports } from "winston";
import { config } from "./configuration";

// define the custom settings for each transport (file, console)
const options = {
    console: {
        colorize: true,
        format: format.combine(
            format.timestamp({
                format: "YYYY-MM-DD HH:mm:ss"
            }),
            format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
        ),
        handleExceptions: true,
        json: false,
        level: config.env === "development" ? "debug" : "info",
    },
    file: {
        colorize: true,
        filename: "./logs/app.log",
        format: format.combine(
            format.timestamp({
                format: "YYYY-MM-DD HH:mm:ss"
            }),
            format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
        ),
        handleExceptions: true,
        json: true,
        level: config.env === "development" ? "debug" : "info",
        maxFiles: 5,
        maxsize: 5242880, // 5MB
    },
};

// instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
    exitOnError: false, // do not exit on handled exceptions
    transports: [
        new transports.File(options.file),
        new transports.Console(options.console)
    ],
});

class WinstonStream {
    public write(text: string) {
        logger.info(text);
    }
}

const loggerStream = new WinstonStream();

export { logger, loggerStream };
