const mongoose = require("mongoose");
const User = require("../models/userModel");
const createError = require("http-errors");

const findWithId = async (id, options = {}) => {
    try {
        const res = await User.findById(id, options);
        if (!res) throw createError(404, "Doesn't Exist");
        return res;
    } catch (error) {
        if (error instanceof mongoose.error) {
            throw createError(400, "Invalid Id");
        }
        throw error;
    }
};

module.exports = { findWithId };
