const express = require("express");
const {
    handleCreateCategory,
    handleGetCategories,
} = require("../controllers/categoryController");
const { validateCategory } = require("../validators/category");
const runValidation = require("../validators");
const { isLoggedIn, isAdmin } = require("../middleware/auth");

const categoryRouter = express.Router();

// POST /api/categories
categoryRouter.post(
    "/",
    isLoggedIn,
    isAdmin,
    validateCategory,
    runValidation,
    handleCreateCategory
);

// GET /api/categories
categoryRouter.get("/", handleGetCategories);

// GET /api/categories/:slug

module.exports = categoryRouter;
