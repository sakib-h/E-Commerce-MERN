const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 3000;
app.use(morgan("dev"));

const isLoggedIn = (req, res, next) => {};

app.get("/test", (req, res) => {
    res.status(200).send({
        message: "Hello World!",
    });
});

app.get("/api/user", (req, res) => {
    res.status(200).send({
        message: "User Profile is Returned",
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
