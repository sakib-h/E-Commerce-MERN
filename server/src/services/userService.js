const createError = require("http-errors");
const User = require("../models/userModel");
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
        throw error;
    }
};

module.exports = { handleUserAction };
