const express = require("express");
const {
    handleCreateProduct,
    handleGetAllProducts,
} = require("../controllers/productController");
const upload = require("../middlewares/fileUpload");
const { validateProduct } = require("../validators/product");
const runValidation = require("../validators");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

const productRouter = express.Router();

// POST: /api/products  --> Create a Product
productRouter.post(
    "/",
    upload.single("image"),
    validateProduct,
    runValidation,
    isLoggedIn,
    isAdmin,
    handleCreateProduct
);

// POST: /api/products --> GEt ALL PRODUCTS
productRouter.get("/", handleGetAllProducts);

module.exports = productRouter;
