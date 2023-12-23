const createError = require("http-errors");
const fs = require("fs");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");

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

const getUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = {
            password: 0,
        };
        const user = await findWithId(id, options);
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

const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await findWithId(id, options);
        const userImagePath = user.image;
        fs.access(userImagePath, (err) => {
            if (!err) {
                fs.unlink(userImagePath, (err) => {
                    if (err) throw err;
                });
            } else {
                console.error("User Image does not exists");
            }
        });
        await user.remove();
        return successResponse(res, {
            statusCode: 200,
            message: "User deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getUsers, getUser, deleteUser };
