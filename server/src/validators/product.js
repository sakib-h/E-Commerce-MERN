const { body } = require("express-validator");
// Name Validation
const validateProduct = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required.")
        .isLength({ min: 3, max: 150 })
        .withMessage(
            "Product name must contain between 3 to 150 characters long"
        ),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required.")
        .isLength({ min: 20, max: 2000 })
        .withMessage(
            "Product description must contain between 20 to 2000 characters long"
        ),

    body("price")
        .trim()
        .notEmpty()
        .withMessage("Price is required.")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),

    body("quantity")
        .trim()
        .notEmpty()
        .withMessage("Quantity is required.")
        .isInt({ min: 0 })
        .withMessage("Quantity must be a positive number"),

    body("category").trim().notEmpty().withMessage("Category is required"),
];

module.exports = { validateProduct };
