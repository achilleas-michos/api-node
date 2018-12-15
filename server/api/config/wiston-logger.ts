import { config } from "./configuration";
import { createLogger, format, transports } from 'winston';

// define the custom settings for each transport (file, console)
const options = {
    file: {
        level: config.env === 'development' ? 'debug' : 'info',
        filename: './logs/app.log',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: true,
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        ),
    },
    console: {
        level: config.env === 'development' ? 'debug' : 'info',
        handleExceptions: true,
        json: false,
        colorize: true,
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        ),
    },
};

// instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
    transports: [
        new transports.File(options.file),
        new transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

class winstonStream {
    write(text: string) {
        logger.info(text)
    }
}

const loggerStream = new winstonStream();


export { logger, loggerStream };