const createError = require("http-errors");
const { successResponse } = require("./responseController");
const Product = require("../models/productModal");

const handleCreateProduct = async (req, res, next) => {
    try {
        const { name, description, price, quantity, shipping, category } =
            req.body;

        const existedProduct = await Product.exists({ name: name });
        if (existedProduct) {
            throw createError(400, "Product name already exists");
        }

        const image = req.file;
        if (!image) {
            throw createError(400, "Product image is required");
        }
        if (image.size > 1024 * 1024 * 2) {
            throw createError(400, "Product image should be less than 2 MB");
        }

        const imageBufferString = image.buffer.toString("base64");

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
