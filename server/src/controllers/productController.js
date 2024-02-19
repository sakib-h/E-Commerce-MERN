const createError = require("http-errors");
const { successResponse } = require("./responseController");

const handleCreateProduct = async (req, res, next) => {
    try {
        const { name, description, price, quantity, shipping, category } =
            req.body;

        const image = req.file;
        if (!image) {
            throw createError(400, "Product image is required");
        }
        if (image.size > 1024 * 1024 * 2) {
            throw createError(400, "Product image should be less than 2 MB");
        }

        return successResponse(res, {
            statusCode: 200,
            message: "Product created successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleCreateProduct,
};
