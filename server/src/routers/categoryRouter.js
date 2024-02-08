const express = require("express");
const { handleCreateCategory } = require("../controllers/categoryController");

const categoryRouter = express.Router();

// POST /api/categories
categoryRouter.post("/", handleCreateCategory);

module.exports = categoryRouter;
