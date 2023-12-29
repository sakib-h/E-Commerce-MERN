const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");
const connectDatabase = async (options = {}) => {
    try {
        await mongoose.connect(mongodbURL, options);

        mongoose.connection.on("error", (err) => {
            console.error("DB connection error", err);
        });
    } catch (error) {
        console.error("Failed to connect to Database", error.toString());
    }
};

module.exports = connectDatabase;
