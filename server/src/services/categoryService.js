const { default: slugify } = require("slugify");
const Category = require("../models/categoryModel");

const createCategory = async (name) => {
    const slug = slugify(name).toLowerCase();
    const newCategory = await Category.create({
        name,
        slug,
    });

    return newCategory;
};

const getCategories = async () => {
    const categories = await Category.find({}).lean();
    return categories;
};

module.exports = { createCategory, getCategories };
