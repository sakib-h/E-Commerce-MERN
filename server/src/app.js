const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();

// express middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
    res.status(200).send({
        message: "Hello World!",
    });
});

app.get("/api/user", (req, res) => {
    console.log(req.body.id);
    res.status(200).send({
        message: "User Profile is Returned",
    });
});

//  client error handling
app.use((req, res, next) => {
    res.status(404).send({
        message: "Page not found",
    });
    next();
});

// server error handling
app.use((err, req, res, next) => {
    res.status(500).send({
        message: "Something went wrong",
    });
});

module.exports = app;
