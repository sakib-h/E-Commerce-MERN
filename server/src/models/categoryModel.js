const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Category Name is required"],
            trim: true,
            unique: true,
            minLength: [3, "Category name must be at least 3 characters long"],
        },
        slug: {
            type: String,
            required: [true, "Category Slug is required"],
            lowercase: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

const Category = model("Category", categorySchema);

module.exports = Category;
