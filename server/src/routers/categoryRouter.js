const express = require("express");
const {
    handleCreateCategory,
    handleGetCategories,
    handleGetCategory,
    handleUpdateCategory,
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
categoryRouter.get("/", handleGetCategories);
categoryRouter.get("/:slug", handleGetCategory);
categoryRouter.put(
    "/:slug",
    isLoggedIn,
    isAdmin,
    validateCategory,
    runValidation,
    handleUpdateCategory
);

module.exports = categoryRouter;
