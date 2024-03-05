const createError = require("http-errors");
const { successResponse } = require("./responseController");
const Product = require("../models/productModal");
const {
    createProduct,
    getAllProducts,
} = require("../services/productServices");

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

const handleGetAllProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const { products, count } = await getAllProducts(page, limit);
        return successResponse(res, {
            statusCode: 200,
            message: "All products fetched successfully",
            payload: {
                products: products,
                pagination: {
                    totalNumberOfProducts: count,
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page > 1 ? page - 1 : null,
                    nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleCreateProduct,
    handleGetAllProducts,
};
