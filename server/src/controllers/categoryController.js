const { successResponse } = require("./responseController");

const handleCreateCategory = async (req, res, next) => {
    try {
        return successResponse(res, {
            statusCode: 201,
            message: "Category created successfully",
            payload: {},
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { handleCreateCategory };
