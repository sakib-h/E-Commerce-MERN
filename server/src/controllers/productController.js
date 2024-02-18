const createError = require("http-errors");
const { successResponse } = require("./responseController");

const handleCreateProduct = async (req, res, next) => {
    try {
        const { name, description, price, quantity, shipping, category } =
            req.body;

        const image = req.file;
        

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
