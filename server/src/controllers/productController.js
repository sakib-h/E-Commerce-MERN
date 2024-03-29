const { successResponse } = require("./responseController");
const {
    createProduct,
    getAllProducts,
    getProduct,
    deleteProduct,
    updateProduct,
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const {
            products,
            count,
            totalPages,
            currentPage,
            previousPage,
            nextPage,
        } = await getAllProducts(page, limit);
        return successResponse(res, {
            statusCode: 200,
            message: "All products fetched successfully",
            payload: {
                products: products,
                pagination: {
                    totalNumberOfProducts: count,
                    totalPages: totalPages,
                    currentPage: currentPage,
                    previousPage: previousPage,
                    nextPage: nextPage,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

const handleGetProduct = async (req, res, next) => {
    try {
        const { slug } = req.params;
        console.log(slug);
        const product = await getProduct(slug);
        return successResponse(res, {
            statusCode: 200,
            message: "Product fetched successfully",
            payload: product,
        });
    } catch (error) {
        next(error);
    }
};

const handleUpdateProduct = async (req, res, next) => {
    try {
        const updatedProduct = await updateProduct(req);
        return successResponse(res, {
            statusCode: 200,
            message: "Product updated successfully",
            payload: updatedProduct,
        });
    } catch (error) {
        next(error);
    }
};

const handleDeleteProduct = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const response = await deleteProduct(slug);
        return successResponse(res, {
            statusCode: 200,
            message: "Product deleted successfully",
            payload: response,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleCreateProduct,
    handleGetAllProducts,
    handleGetProduct,
    handleUpdateProduct,
    handleDeleteProduct,
};
