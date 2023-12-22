require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3001;
const mongodbURL = process.env.MONGODB_URL;
const defaultImagePath =
    process.env.DEFAULT_USER_IMAGE_PATH || "public/images/default-user.png";

module.exports = { serverPort, mongodbURL, defaultImagePath };
