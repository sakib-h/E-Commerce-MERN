const express = require("express");
const { handleCreateProduct } = require("../controllers/productController");

const productRouter = express.Router();

// POST: /api/products
productRouter.post("/", handleCreateProduct);

module.exports = productRouter;
