const createError = require("http-errors");
const { successResponse } = require("./responseController");

const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
} = require("../services/categoryService");

const handleCreateCategory = async (req, res, next) => {
    try {
        const newCategory = await createCategory(req.body.name);

        return successResponse(res, {
            statusCode: 201,
            message: "Category created successfully",
            payload: newCategory,
        });
    } catch (error) {
        next(error);
    }
};

const handleGetCategories = async (req, res, next) => {
    try {
        const categories = await getCategories();
        if (!categories || categories.length === 0) {
            return next(createError(404, "No categories found"));
        }

        return successResponse(res, {
            statusCode: 200,
            message: "Categories retrieved successfully",
            payload: categories,
        });
    } catch (error) {
        next(error);
    }
};

const handleGetCategory = async (req, res, next) => {
    try {
        const category = await getCategory(req.params.slug);
        if (!category) {
            return next(createError(404, "Category not found"));
        }
        return successResponse(res, {
            statusCode: 200,
            message: "Category retrieved successfully",
            payload: category,
        });
    } catch (error) {
        next(error);
    }
};

const handleUpdateCategory = async (req, res, next) => {
    try {
        const updatedCategory = await updateCategory(
            req.params.slug,
            req.body.name
        );
        if (!updatedCategory) {
            return next(createError(404, "Failed to update category"));
        }
        return successResponse(res, {
            statusCode: 200,
            message: "Category updated successfully",
            payload: updatedCategory,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleCreateCategory,
    handleGetCategories,
    handleGetCategory,
    handleUpdateCategory,
};
