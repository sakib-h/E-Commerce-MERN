require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3001;
const mongodbURL = process.env.MONGODB_URL;
const defaultImagePath =
    process.env.DEFAULT_USER_IMAGE_PATH ||
    "public/images/users/default-user.png";

const jwtActivationKey =
    process.env.JWT_ACTIVATION_KEY ||
    "yaHCPRwPuOnxlOq8Nhbry6tELIefCwbb0zK1ck7KhOATccEg0ykdwwMpfg3SBnHImMRTQjiw2mODPgtJsQeUxw==";

const jwtAccessKey = process.env.JWT_ACCESS_KEY;
const jwtResetKey = process.env.JWT_RESET_KEY;

const smtpUsername = process.env.SMTP_USERNAME || "sakib100.sa@gmail.com";
const smtpPassword = process.env.SMTP_PASSWORD;
const clientURL = process.env.CLIENT_URL;
const jwtRefreshKey = process.env.JWT_REFRESH_KEY;

module.exports = {
    serverPort,
    mongodbURL,
    defaultImagePath,
    jwtActivationKey,
    jwtAccessKey,
    jwtResetKey,
    jwtRefreshKey,
    smtpUsername,
    smtpPassword,
    clientURL,
};
