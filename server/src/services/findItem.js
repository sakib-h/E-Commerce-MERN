const mongoose = require("mongoose");
const createError = require("http-errors");

const findWithId = async (Model, id, options = {}) => {
    try {
        const res = await Model.findById(id, options);
        if (!res) throw createError(404, `${Model.modelName} does not exist`);
        return res;
    } catch (error) {
        if (error instanceof mongoose.Error) {
            throw createError(400, `Invalid ${Model.modelName} id`);
        }
        throw error;
    }
};

module.exports = { findWithId };
