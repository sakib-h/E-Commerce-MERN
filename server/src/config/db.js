const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");
const logger = require("../controllers/loggerController");
const connectDatabase = async (options = {}) => {
    try {
        await mongoose.connect(mongodbURL, options);
        mongoose.connection.on("error", (err) => {
            logger.log("error", "DB connection error", err);
        });
    } catch (error) {
        logger.log("error", "Failed to connect to Database", error);
    }
};

module.exports = connectDatabase;
