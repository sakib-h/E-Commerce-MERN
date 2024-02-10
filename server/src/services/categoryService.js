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

const getCategory = async (slug) => {
    const category = await Category.find({ slug }).lean();
    return category;
};

const updateCategory = async (slug, name) => {
    const filter = { slug };
    const updates = { name: name, slug: slugify(name).toLowerCase() };
    const options = { new: true };
    const updatedCategory = await Category.findOneAndUpdate(
        filter, // find category by slug
        updates, // update name and slug
        options // return updated category
    );
    return updatedCategory;
};

const deleteCategory = async (slug) => {
    const response = await Category.findOneAndDelete({ slug });
    return response;
};

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
};
