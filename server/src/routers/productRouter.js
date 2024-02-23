const express = require("express");
const { handleCreateProduct } = require("../controllers/productController");
const upload = require("../middlewares/fileUpload");
const { validateProduct } = require("../validators/product");
const runValidation = require("../validators");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

const productRouter = express.Router();

// POST: /api/products
productRouter.post(
    "/",
    upload.single("image"),
    validateProduct,
    runValidation,
    isLoggedIn,
    isAdmin,
    handleCreateProduct
);

module.exports = productRouter;
