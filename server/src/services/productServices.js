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

const getProduct = async (slug) => {
    const product = await Product.findOne({ slug: slug }).populate("category");

    if (!product) throw createError(404, "Product not found");

    return product;
};

const updateProduct = async (req) => {
    try {
        const { slug } = req.params;

        const updateOptions = {
            new: true,
            runValidators: true,
            context: "query",
        };
        let updates = {};

        const updateItems = [
            "name",
            "description",
            "price",
            "sold",
            "quantity",
            "shipping",
        ];

        for (const key in req.body) {
            if (updateItems.includes(key)) {
                if (key === "name") {
                    updates.slug = slugify(req.body[key]);
                }
                updates[key] = req.body[key];
            }
        }

        const image = req.file;
        if (image) {
            // Maximum image size 2 MB
            if (image.size > 2097152) {
                throw createError(
                    400,
                    "File too large! Image size must be less than 2MB"
                );
            }
            updates.image = image.buffer.toString("base64");
        }

        const updateProduct = await Product.findOneAndUpdate(
            { slug },
            updates,
            updateOptions
        );

        if (!updateProduct)
            throw createError(
                404,
                "Product not found or user not authorized to update product"
            );
        return updateProduct;
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(400, "Invalid user id");
        }
        throw error;
    }
};

const deleteProduct = async (slug) => {
    const response = await Product.findOneAndDelete({ slug: slug });
    if (!response) throw createError(404, "Product not found");
    return response;
};

module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
};
