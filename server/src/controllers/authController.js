const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jsonWebToken");
const { jwtAccessKey } = require("../secret");

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

        // token cookie
        const accessToken = createJSONWebToken({ email }, jwtAccessKey, "10m");

        // Send the response
        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 10 * 60 * 1000, // 10 minutes
        });
        return successResponse(res, {
            statusCode: 200,
            message: "User Logged in successfully",
            payload: {},
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { handleLogin };
