const express = require("express");
const { handleCreateProduct } = require("../controllers/productController");
const upload = require("../middlewares/fileUpload");
const { validateProduct } = require("../validators/product");
const runValidation = require("../validators");

const productRouter = express.Router();

// POST: /api/products
productRouter.post("/", validateProduct, runValidation, upload.single("image"), handleCreateProduct);

module.exports = productRouter;
