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
    },
    {
        timestamps: true,
    }
);

const Product = model("Product", productSchema);

module.exports = Product;
