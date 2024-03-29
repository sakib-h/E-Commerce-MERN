const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jsonWebToken");
const { jwtActivationKey, clientURL, jwtResetKey } = require("../secret");
const sendEmailWithNodemailer = require("../helper/email");
const {
    handleUserAction,
    getUsers,
    findUserById,
    deleteUser,
    updateUser,
    updatePassword,
    forgetPassword,
    resetPassword,
} = require("../services/userService");
const checkUserExists = require("../helper/checkUserExists");
const sendEmail = require("../helper/sendEmail");
const handleGetAllUsers = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const { users, pagination } = await getUsers(search, limit, page);

        return successResponse(res, {
            statusCode: 200,
            message: "User Profile is Returned",
            payload: {
                users,
                pagination,
            },
        });
    } catch (error) {
        next(error);
    }
};

const handleGetUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = {
            password: 0,
        };
        const user = await findUserById(id, options);
        return successResponse(res, {
            statusCode: 200,
            message: "User Profile is Returned",
            payload: user,
        });
    } catch (error) {
        next(error);
    }
};

const handleDeleteUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        await deleteUser(id);

        return successResponse(res, {
            statusCode: 200,
            message: "User deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

const handleProcessRegister = async (req, res, next) => {
    try {
        const { name, email, password, phone, address } = req.body;

        const userExists = await checkUserExists(email);
        if (userExists) {
            throw createError(
                409,
                " User with this email address already exists. Please sign in."
            );
        }

        const tokenPayloadData = {
            name,
            email,
            password,
            phone,
            address,
        };
        const image = req.file;

        if (image) {
            if (image.size > 2097152) {
                throw createError(
                    400,
                    "File too large! Image size must be less than 2MB"
                );
            }
            tokenPayloadData.image = image.buffer.toString("base64");
        }

        // create JWT token

        const token = createJSONWebToken(
            tokenPayloadData,
            jwtActivationKey,
            "10m"
        );

        // Prepare email
        const emailData = {
            email: email,
            subject: "Please confirm your email",
            html: `
                <h2>Hello ${name},</h2>
                <p>Please click here to <a href="${clientURL}/api/users/activate/${token}" target="_blank">Activate your account </a>  account. </p>
            
            `,
        };

        // Send Email
        await sendEmail(emailData);

        return successResponse(res, {
            statusCode: 200,
            message: `Please check your ${email} to activate your account`,
        });
    } catch (error) {
        next(error);
    }
};

const handleActivateUserAccount = async (req, res, next) => {
    try {
        const token = req.body.token;
        if (!token) throw createError(400, "Token not found");
        try {
            const decoded = jwt.verify(token, jwtActivationKey);
            if (!decoded)
                throw createError(
                    401,
                    "Failed to verify user, please try again letter"
                );
            const userExists = await User.exists({ email: decoded.email });

            userExists &&
                next(
                    createError(
                        401,
                        " User with this email address already exists. Please sign in."
                    )
                );

            const user = await User.create(decoded);
            if (!user) throw createError(500, "Failed to create user");
            return successResponse(res, {
                statusCode: 201,
                message: "User registered successfully",
            });
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw createError(401, "Token Expired, Please try again");
            } else if (error.name === "JsonWebTokenError") {
                throw createError(401, "Invalid Token, Please try again");
            }
        }
    } catch (error) {
        next(error);
    }
};

const handleUpdateUserById = async (req, res, next) => {
    try {
        const updatedUser = await updateUser(req);
        return successResponse(res, {
            statusCode: 200,
            message: "User updated successfully",
            payload: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

const handleManageUserBannedStatus = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const action = req.body.action;
        const updatedUser = await handleUserAction(userId, action);
        return successResponse(res, {
            statusCode: 200,
            message: `User ${action} successfully`,
            payload: updatedUser,
        });
    } catch (error) {
        return next(error);
    }
};

const handleUpdateUserPassword = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const updatedUser = await updatePassword(
            userId,
            oldPassword,
            newPassword,
            confirmPassword
        );
        return successResponse(res, {
            statusCode: 200,
            message: "Password updated successfully",
            payload: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

const handleForgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const token = await forgetPassword(email);

        return successResponse(res, {
            statusCode: 200,
            message: `Please check your ${email} to reset your password`,
            payload: token,
        });
    } catch (error) {
        next(error);
    }
};

const handleResetPassword = async (req, res, next) => {
    try {
        const token = req.params.token;
        const { newPassword, confirmPassword } = req.body;
        const updatedUser = await resetPassword(
            token,
            newPassword,
            confirmPassword
        );

        return successResponse(res, {
            statusCode: 200,
            message: "Password reset successfully",
            payload: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    handleGetAllUsers,
    handleGetUserById,
    handleDeleteUserById,
    handleProcessRegister,
    handleActivateUserAccount,
    handleUpdateUserById,
    handleManageUserBannedStatus,
    handleUpdateUserPassword,
    handleForgetPassword,
    handleResetPassword,
};
