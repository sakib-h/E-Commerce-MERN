const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            throw createError(401, "You need to log in first.");
        }
        const decoded = jwt.verify(accessToken, jwtAccessKey);
        if (!decoded) {
            throw createError(401, "Invalid access token. Please try again.");
        }
        req.user = decoded.user;
        next();
    } catch (error) {
        return next(error);
    }
};

const isLoggedOut = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, jwtAccessKey);
                if (decoded) {
                    throw createError(401, "User already logged in.");
                }
            } catch (error) {
                throw error;
            }
            throw createError(400, "User already logged in.");
        }
        next();
    } catch (error) {
        return next(error);
    }
};

const isAdmin = async (req, res, next) => {
    try {
    } catch (error) {
        throw next(error);
    }
};

module.exports = { isLoggedIn, isLoggedOut, isAdmin };
