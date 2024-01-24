const { body } = require("express-validator");
// Registration Validation
const validateUserRegistration = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required. Please enter your name")
        .isLength({ min: 3, max: 32 })
        .withMessage("Name must be between 3 to 32 characters long"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required. Please enter a valid email address")
        .isEmail()
        .withMessage("Invalid email address"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required. Please enter your password")
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters long")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/
        )
        .withMessage(
            "Password must contain at least one uppercase, one lowercase, one number and one special character"
        ),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required. Please enter your address")
        .isLength({ min: 3 })
        .withMessage("Address should be at least 3 characters long"),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone is required. Please enter your phone number"),

    body("image").optional().isString().withMessage("Invalid image file"),
];

const validateUserLogin = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required. Please enter an email address")
        .isEmail()
        .withMessage("Invalid email address"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required. Please enter your password")
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters long")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/
        )
        .withMessage(
            "Password must contain at least one uppercase, one lowercase, one number and one special character"
        ),
];

const validateUpdatePassword = [
    body("oldPassword")
        .trim()
        .notEmpty()
        .withMessage("Old Password is required. Please enter your password")
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters long")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/
        )
        .withMessage(
            "Password must contain at least one uppercase, one lowercase, one number and one special character"
        ),
    body("newPassword")
        .trim()
        .notEmpty()
        .withMessage("New Password is required. Please enter your password")
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters long")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/
        )
        .withMessage(
            "Password must contain at least one uppercase, one lowercase, one number and one special character"
        ),
];

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateUpdatePassword,
};
