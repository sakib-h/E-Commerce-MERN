const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jsonWebToken");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");
const {
    setAccessTokenCookie,
    setRefreshTokenCookie,
} = require("../helper/setCookies");

const handleLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Find the user with the email
        const user = await User.findOne({ email });
        if (!user) {
            throw createError(
                404,
                "User does not exist with this email. Please sign up."
            );
        }
        // Compare the password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw createError(401, "Invalid password. Please try again.");
        }

        // Banned user
        if (user.isBanned) {
            throw createError(401, "You are banned. Please contact admin.");
        }

        // Access token
        const accessToken = createJSONWebToken({ user }, jwtAccessKey, "15m");

        // set the access token in the cookie
        setAccessTokenCookie(res, accessToken);

        // Refresh token
        const refreshToken = createJSONWebToken({ user }, jwtRefreshKey, "7d");

        // set the refresh token in the cookie
        setRefreshTokenCookie(res, refreshToken);

        // Send the response
        const responseData = user.toObject();
        delete responseData.password;

        return successResponse(res, {
            statusCode: 200,
            message: "User Logged in successfully",
            payload: { responseData },
        });
    } catch (error) {
        next(error);
    }
};

const handleRefreshToken = async (req, res, next) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;
        if (!oldRefreshToken) {
            throw createError(401, "Please login to continue.");
        }
        const { user } = jwt.verify(oldRefreshToken, jwtRefreshKey);

        if (!user) {
            throw createError(401, "Please login to continue.");
        }
        const accessToken = createJSONWebToken({ user }, jwtAccessKey, "15m");

        // Send the response
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        return successResponse(res, {
            statusCode: 200,
            message: "New access token generated successfully",
            payload: {},
        });
    } catch (error) {
        next(error);
    }
};

const handleProtectedRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            throw createError(401, "Please login to continue.");
        }
        const { user } = jwt.verify(accessToken, jwtAccessKey);
        if (!user) {
            throw createError(401, "Please login to continue.");
        }
        return successResponse(res, {
            statusCode: 200,
            message: "You are authorized to access this route.",
            payload: {},
        });
    } catch (error) {
        next(error);
    }
};

const handleLogout = async (req, res, next) => {
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        successResponse(res, {
            statusCode: 200,
            message: "User Logged out successfully",
            payload: {},
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    handleLogin,
    handleRefreshToken,
    handleProtectedRoute,
    handleLogout,
};
