/* istanbul ignore file */
//write logger.info or logger.error("BLAGH") for logging messages
import winston from "winston";

export const logger = winston.createLogger({
    level: 'debug',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.simple(),
                winston.format.colorize({ all: true })
            ),
        }),
        new winston.transports.File({
            filename: '../backend/logFiles/tests.log',
            format: winston.format.simple()
        })
    ]
});