require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3001;
const mongodbURL = process.env.MONGODB_URL;

module.exports = { serverPort, mongodbURL };
