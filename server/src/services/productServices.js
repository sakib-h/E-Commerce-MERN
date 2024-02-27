const createError = require("http-errors");
const Product = require("../models/productModal");
const slugify = require("slugify");

const createProduct = async (req) => {
    const { name, description, price, quantity, shipping, category } = req.body;

    const existedProduct = await Product.exists({ name: name });
    if (existedProduct) {
        throw createError(409, "Product with this name already exists");
    }

    const image = req.file;
    if (!image) {
        throw createError(400, "Product image is required");
    }
    if (image.size > 1024 * 1024 * 2) {
        throw createError(400, "Product image should be less than 2 MB");
    }

    const imageBufferString = image.buffer.toString("base64");

    const productInfo = {
        name,
        slug: slugify(name),
        description,
        price,
        quantity,
        shipping,
        category,
    };

    if (image) {
        productInfo.image = imageBufferString;
    }

    const product = await Product.create(productInfo);

    return product;
};

module.exports = { createProduct };
