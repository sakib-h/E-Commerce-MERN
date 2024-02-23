const express = require("express");
const { handleCreateProduct } = require("../controllers/productController");
const upload = require("../middlewares/fileUpload");

const productRouter = express.Router();

// POST: /api/products
productRouter.post("/", upload.single("image"), handleCreateProduct);

module.exports = productRouter;
