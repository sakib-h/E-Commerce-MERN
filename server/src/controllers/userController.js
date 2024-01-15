const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const { deleteImage } = require("../helper/deleteImage");
const { createJSONWebToken } = require("../helper/jsonWebToken");
const { jwtActivationKey, clientURL } = require("../secret");
const sendEmailWithNodemailer = require("../helper/email");

const getUsers = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchRegExp = new RegExp(".*" + search + ".*", "i");
        const filter = {
            isAdmin: {
                $ne: true,
            },
            $or: [
                { name: { $regex: searchRegExp } },
                { email: { $regex: searchRegExp } },
                { phone: { $regex: searchRegExp } },
            ],
        };
        const options = { password: 0 };
        const users = await User.find(filter, options)
            .limit(limit)
            .skip((page - 1) * limit);

        const count = await User.find(filter).countDocuments();

        if (!users) throw createError(404, "No Users Found");
        return successResponse(res, {
            statusCode: 200,
            message: "User Profile is Returned",
            payload: {
                users,
                pagination: {
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page - 1 > 0 ? page - 1 : null,
                    nextPage:
                        page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
                    totalUsers: count,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        console.log(req.user);
        const id = req.params.id;
        const options = {
            password: 0,
        };
        const user = await findWithId(User, id, options);
        return successResponse(res, {
            statusCode: 200,
            message: "User return successfully",
            payload: {
                user,
            },
        });
    } catch (error) {
        next(error);
    }
};

const deleteUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        await User.findByIdAndDelete({
            _id: id,
            isAdmin: false,
        });

        return successResponse(res, {
            statusCode: 200,
            message: "User deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

const processRegister = async (req, res, next) => {
    try {
        const { name, email, password, phone, address } = req.body;

        const userExists = await User.exists({ email: email });
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
        try {
            await sendEmailWithNodemailer(emailData);
        } catch (error) {
            next(createError(500, "Failed to send verification email"));
            return;
        }

        return successResponse(res, {
            statusCode: 200,
            message: `Please check your ${email} to activate your account`,
            payload: {
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

const activateUserAccount = async (req, res, next) => {
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

const updateUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const options = { password: 0 };
        const user = await findWithId(User, userId, options);

        if (!user) throw createError(404, "User with this id does not exists");

        const updateOptions = {
            new: true,
            runValidators: true,
            context: "query",
        };
        let updates = {};

        for (let key in req.body) {
            if (["name", "password", "phone", "address"].includes(key)) {
                updates[key] = req.body[key];
            } else if (["email"].includes(key)) {
                throw createError(400, "Email cannot be updated");
            }
        }

        const image = req.file;
        if (image) {
            // Maximum image size 2 MB
            if (image.size > 2097152) {
                throw createError(
                    400,
                    "File too large! Image size must be less than 2MB"
                );
            }
            updates.image = image.buffer.toString("base64");
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            updateOptions
        ).select("-password");

        if (!updatedUser)
            throw createError(404, "User with this id does not exists");

        return successResponse(res, {
            statusCode: 200,
            message: "User updated successfully",
            payload: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

const manageUserBannedStatus = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const action = req.body.action;

        const updates = {
            isBanned:
                (action === "banned" && true) ||
                (action === "unbanned" && false),
        };

        const updateOptions = {
            new: true,
            runValidators: true,
            context: "query",
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            updateOptions
        ).select("-password");
        if (!updatedUser) {
            throw createError(
                400,
                `Failed to ${action} user. Please try again`
            );
        }

        return successResponse(res, {
            statusCode: 200,
            message: `User ${action} successfully`,
            payload: updatedUser,
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getUsers,
    getUserById,
    deleteUserById,
    processRegister,
    activateUserAccount,
    updateUserById,
    manageUserBannedStatus,
};
