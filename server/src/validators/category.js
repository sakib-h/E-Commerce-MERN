const { body } = require("express-validator");
// Name Validation
const validateCategory = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required.")
        .isLength({ min: 3 })
        .withMessage("Category name must contain at least 3 characters"),
];

module.exports = { validateCategory };
