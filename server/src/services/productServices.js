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

const getAllProducts = async (page, limit) => {
    const products = await Product.find({})
        .populate("category") // Get all information about category
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    if (!products) throw createError(404, "No products found");

    const count = await Product.find({}).countDocuments();

    return {
        products,
        count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        previousPage: page > 1 ? page - 1 : null,
        nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
    };
};

module.exports = { createProduct, getAllProducts };
