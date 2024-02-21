const { body } = require("express-validator");
// Name Validation
const validateProduct = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required.")
        .isLength({ min: 3, max: 150 })
        .withMessage(
            "Product name must contain minimum 3 & maximum 150 characters long"
        ),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required."),
];

module.exports = { validateProduct };
