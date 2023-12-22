const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const app = express();

// rate limiter
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // 10 requests,
    message: "Too many requests, please try again later.", // message to send
});

// express middleware
app.use(morgan("dev"));
app.use(xssClean());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Users Router
app.use("/api/users", userRouter);
app.use("/api/seed", seedRouter);

//  client error handling
app.use((req, res, next) => {
    next(createError(404, "Page not found"));
});

// server error handling
app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({
        success: false,
        message: err.message,
    });
});

module.exports = app;
