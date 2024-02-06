const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");
const logger = require("../controllers/loggerController");
const connectDatabase = async (options = {}) => {
    try {
        await mongoose.connect(mongodbURL, options);
        logger.log("info", "Connected to Database");
        mongoose.connection.on("error", (err) => {
            console.error("DB connection error", err);
        });
    } catch (error) {
        console.error("Failed to connect to Database", error.toString());
    }
};

module.exports = connectDatabase;
