const { createLogger, format, transports } = require("winston");

const logger = createLogger({
    level: "info",
    format: format.combine(
        format.json(),
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        })
    ),

    transports: [
        new transports.File({
            filename: "src/logs/info.log",
            level: "info",
            // maxsize: 5242880, // 5MB
            // maxFiles: 1,
        }),

        new transports.File({
            filename: "src/logs/error.log",
            level: "error",
            // maxsize: 5242880, // 5MB
            // maxFiles: 1,
        }),
    ],
});

module.exports = logger;
