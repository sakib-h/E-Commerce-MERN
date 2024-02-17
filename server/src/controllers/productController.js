const { successResponse } = require("./responseController");
const createError = require("http-errors");
const Product = require("../models/productModal");
const slugify = require("slugify");
const handleCreateProduct = async (req, res, next) => {
    try {
        const { name, description, price, quantity, shipping, category } =
            req.body;

        const image = req.file;

        if (!image) {
            throw createError(400, "Image is required");
        }

        if (image.size > 1024 * 1024 * 5) {
            throw createError(400, "Image should be less than 5mb");
        }

        const imageBufferString = image.buffer.toString("base64");

        const isProductExists = await Product.exists({ name: name });
        if (isProductExists) {
            throw createError(409, "Product with this name already exists");
        }

        const product = await Product.create({
            name: name,
            slug: slugify(name),
            description: description,
            price: price,
            quantity: quantity,
            shipping: shipping,
            image: imageBufferString,
            category: category,
        });

        if (!product) {
            throw createError(
                500,
                "Product creation failed. Please try again."
            );
        }

        return successResponse(res, {
            statusCode: 201,
            message: "Product created successfully",
            payload: { product },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { handleCreateProduct };
