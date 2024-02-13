const { Schema, model } = require("mongoose");

// name, slug, price, quantity, sold, shipping, description, productPictures, category, createdBy
const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            minLength: [2, "Product name must be at least 2 characters long"],
            maxLength: [
                150,
                "Product name must be at most 150 characters long",
            ],
        },
        slug: {
            type: String,
            required: [true, "Product slug is required"],
            lowercase: true,
            unique: true,
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true,
            minLength: [
                20,
                "Product description must be at least 20 characters long",
            ],
            maxLength: [
                2000,
                "Product description must be at most 2000 characters long",
            ],
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            trim: true,
            validate: {
                validator: (v) => v > 0,
                message: (props) =>
                    `${props.value} is not a valid price! Price must be greater than 0`,
            },
        },
        quantity: {
            type: Number,
            required: [true, "Product quantity is required"],
            trim: true,
            validate: {
                validator: (v) => v >= 0,
                message: (props) =>
                    `${props.value} is not a valid quantity! Quantity must be greater than or equal to 0`,
            },
        },
        sold: {
            type: Number,
            required: [true, "Sold quantity is required"],
            trim: true,
            default: 0,
            validate: {
                validator: (v) => v >= 0,
                message: (props) =>
                    `${props.value} is not a valid quantity! Sold quantity must be greater than or equal to 0`,
            },
        },

        shipping: {
            type: Number,
            default: 0, // shipping cost is 0 by default
        },

        image: {
            type: Buffer,
            contentType: String,
            required: [true, "Product image is required"],
        },
    },
    {
        timestamps: true,
    }
);

const Product = model("Product", productSchema);

module.exports = Product;
