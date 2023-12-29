require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3001;
const mongodbURL = process.env.MONGODB_URL;
const defaultImagePath =
    process.env.DEFAULT_USER_IMAGE_PATH || "public/images/default-user.png";

const jwtActivationKey =
    process.env.JWT_ACTIVATION_KEY ||
    "yaHCPRwPuOnxlOq8Nhbry6tELIefCwbb0zK1ck7KhOATccEg0ykdwwMpfg3SBnHImMRTQjiw2mODPgtJsQeUxw==";

const smtpUsername = process.env.SMTP_USERNAME || "sakib100.sa@gmail.com";
const smtpPassword = process.env.SMTP_PASSWORD;
const clientURL = process.env.CLIENT_URL;
const uploadDir = process.env.UPLOAD_FILE;
module.exports = {
    serverPort,
    mongodbURL,
    defaultImagePath,
    jwtActivationKey,
    smtpUsername,
    smtpPassword,
    clientURL,
    uploadDir,
};
