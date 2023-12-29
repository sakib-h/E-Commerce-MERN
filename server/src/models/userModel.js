const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { defaultImagePath } = require("../secret");
const usersSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "User Name is required"],
            trim: true,
            minLength: [3, "User Name cannot be less than 3 characters"],
            maxLength: [32, "User Name cannot be more than 32 characters"],
        },
        email: {
            type: String,
            required: [true, "User Email is required"],
            trim: true,
            unique: true,
            lowercase: true,
            validate: {
                validator: (value) => {
                    return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
                },
                message: "Please enter a valid email address",
            },
        },
        password: {
            type: String,
            required: [true, "User Password is required"],
            minLength: [6, "User Password cannot be less than 6 characters"],
            set: (value) => {
                return bcrypt.hashSync(value, bcrypt.genSaltSync(10));
            },
        },
        image: {
            type: String,
            default: defaultImagePath,
        },
        address: {
            type: String,
            required: [true, "User Address is required"],
            minLength: [3, "Address cannot be less than 3 characters"],
        },
        phone: {
            type: String,
            required: [true, "User Phone is required"],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const User = model("User", usersSchema);

module.exports = User;
