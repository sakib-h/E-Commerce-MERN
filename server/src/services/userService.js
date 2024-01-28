const createError = require("http-errors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const { createJSONWebToken } = require("../helper/jsonWebToken");
const sendEmailWithNodemailer = require("../helper/email");
const { jwtResetKey, clientURL } = require("../secret");

const getUsers = async (search, limit, page) => {
    try {
        const searchRegExp = new RegExp(".*" + search + ".*", "i");
        const filter = {
            isAdmin: {
                $ne: true,
            },
            $or: [
                { name: { $regex: searchRegExp } },
                { email: { $regex: searchRegExp } },
                { phone: { $regex: searchRegExp } },
            ],
        };
        const options = { password: 0 };
        const users = await User.find(filter, options)
            .limit(limit)
            .skip((page - 1) * limit);

        const count = await User.find(filter).countDocuments();

        if (!users || users.length === 0)
            throw createError(404, "No Users Found");

        return {
            users,
            pagination: {
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page - 1 > 0 ? page - 1 : null,
                nextPage:
                    page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
                totalUsers: count,
            },
        };
    } catch (error) {
        throw error;
    }
};

const findUserById = async (id, options) => {
    try {
        const user = await User.findById(id, options);
        if (!user) throw createError(404, "User not found");
        return user;
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(400, "Invalid user id");
        }
        throw error;
    }
};

const deleteUser = async (id) => {
    try {
        await User.findByIdAndDelete({
            _id: id,
            isAdmin: false,
        });
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(400, "Invalid user id");
        }
        throw error;
    }
};

const updateUser = async (req) => {
    try {
        const userId = req.params.id;
        const options = {
            password: 0,
        };
        const user = await findUserById(userId, options);
        if (!user) throw createError(404, "User with this id does not exists");

        const updateOptions = {
            new: true,
            runValidators: true,
            context: "query",
        };
        let updates = {};

        for (let key in req.body) {
            if (["name", "password", "phone", "address"].includes(key)) {
                updates[key] = req.body[key];
            } else if (["email"].includes(key)) {
                throw createError(400, "Email cannot be updated");
            }
        }

        const image = req.file;
        if (image) {
            // Maximum image size 2 MB
            if (image.size > 2097152) {
                throw createError(
                    400,
                    "File too large! Image size must be less than 2MB"
                );
            }
            updates.image = image.buffer.toString("base64");
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            updateOptions
        ).select("-password");

        if (!updatedUser)
            throw createError(404, "User with this id does not exists");
        return updatedUser;
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(400, "Invalid user id");
        }
        throw error;
    }
};

const updatePassword = async (
    userId,
    oldPassword,
    newPassword,
    confirmPassword
) => {
    try {
        const user = await findUserById(userId);
        const isPasswordMatched = await bcrypt.compare(
            oldPassword,
            user.password
        );
        if (!isPasswordMatched)
            throw createError(400, "Wrong password, Please try again");
        if (oldPassword === newPassword) {
            throw createError(
                400,
                "New password cannot be same as old password"
            );
        }
        if (newPassword !== confirmPassword)
            throw createError(400, "Password does not match, Please try again");

        const updates = { password: newPassword };
        const options = { new: true, password: 0 };
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            options
        ).select("-password");
        if (!updatedUser)
            throw createError(
                400,
                "Failed to update password, Please try again"
            );
        return updatedUser;
    } catch (error) {
        throw error;
    }
};

const forgetPassword = async (email) => {
    try {
        const userData = await User.findOne({ email: email });
        if (!userData) {
            throw createError(404, "User not found");
        }

        // Create JWT token
        const token = createJSONWebToken({ email }, jwtResetKey, "10m");

        // Prepare email
        const emailData = {
            email,
            subject: "Reset Password Link",
            html: `
            <h2>Hello ${userData.name},</h2>
            <p>Please click here to <a href="${clientURL}/reset-password/${token}" target="_blank">Reset Password </a>  account. </p>
        
        `,
        };

        // Send email
        try {
            await sendEmailWithNodemailer(emailData);
            return token;
        } catch (error) {
            next(createError(500, "Failed to send verification email"));
            return;
        }
    } catch (error) {
        throw error;
    }
};
const handleUserAction = async (userId, action) => {
    try {
        if (!["banned", "unbanned"].includes(action)) {
            throw createError(400, "Invalid action");
        }

        const updates = {
            isBanned:
                (action === "banned" && true) ||
                (action === "unbanned" && false),
        };

        const updateOptions = {
            new: true,
            runValidators: true,
            context: "query",
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            updateOptions
        ).select("-password");
        if (!updatedUser) {
            throw createError(
                400,
                `Failed to ${action} user. Please try again`
            );
        }

        return updatedUser;
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(400, "Invalid user id");
        }
        throw error;
    }
};

const resetPassword = async (token, newPassword, confirmPassword) => {
    try {
        if (!token) throw createError(400, "Token not found");

        const decoded = jwt.verify(token, jwtResetKey);
        if (!decoded)
            throw createError(
                401,
                "Failed to verify user, please try again letter"
            );

        if (newPassword !== confirmPassword) {
            throw createError(400, "Password does not match, Please try again");
        }
        const updatedUser = await User.findOneAndUpdate(
            { email: decoded.email },
            { password: newPassword },
            { new: true }
        ).select("-password");
        if (!updatedUser)
            throw createError(
                404,
                "Failed to reset password. Please try again"
            );
        return updatedUser;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw createError(401, "Token Expired, Please try again");
        } else if (error.name === "JsonWebTokenError") {
            throw createError(401, "Invalid Token, Please try again");
        }
    }
};

module.exports = {
    getUsers,
    findUserById,
    deleteUser,
    updateUser,
    updatePassword,
    forgetPassword,
    resetPassword,
    handleUserAction,
};
