const express = require("express");
const {
    handleCreateProduct,
    handleGetAllProducts,
    handleGetProduct,
    handleDeleteProduct,
    handleUpdateProduct,
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

// POST: /api/products/:slug --> GEt PRODUCT
productRouter.get("/:slug", handleGetProduct);

// PUT: /api/products/:slug --> UPDATE SINGLE PRODUCT
productRouter.put(
    "/:slug",
    upload.single("image"),
    isLoggedIn,
    isAdmin,
    handleUpdateProduct
);

// DELETE: /api/products/:slug --> DELETE SINGLE PRODUCT
productRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteProduct);

module.exports = productRouter;
