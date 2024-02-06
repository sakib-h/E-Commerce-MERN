var jwt = require("jsonwebtoken");
const logger = require("../controllers/loggerController");

const createJSONWebToken = (payload, secretKey, expiresIn) => {
    if (typeof payload !== "object" || !payload) {
        throw new Error("payload must be a non-empty object");
    }
    if (typeof secretKey !== "string" || secretKey === "") {
        throw new Error("secretKey must be a non-empty string");
    }
    try {
        const token = jwt.sign(payload, secretKey, { expiresIn });
        return token;
    } catch (error) {
        logger.log("error", "Failed to create JSON web toke", error);
        throw error;
    }
};
module.exports = { createJSONWebToken };
