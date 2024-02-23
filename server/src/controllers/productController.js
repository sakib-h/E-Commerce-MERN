const createError = require("http-errors");
const slugify = require("slugify");
const { successResponse } = require("./responseController");
const Product = require("../models/productModal");
const { createProduct } = require("../services/productServices");

const handleCreateProduct = async (req, res, next) => {
    try {
        const product = await createProduct(req);
        return successResponse(res, {
            statusCode: 200,
            message: "Product created successfully",
            payload: product,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleCreateProduct,
};
