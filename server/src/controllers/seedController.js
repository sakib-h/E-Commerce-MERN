const data = require("../data");
const Product = require("../models/productModal");
const User = require("../models/userModel");
const seedUser = async (req, res, next) => {
    try {
        // deleting all existing users
        await User.deleteMany({});

        // creating new users
        const createdUsers = await User.insertMany(data.users);
        return res.status(201).json(createdUsers);
    } catch (error) {
        next(error);
    }
};

const seedProducts = async (req, res, next) => {
    try {
        // deleting all existing products
        await Product.deleteMany({});

        // creating new products
        const createdProducts = await Product.insertMany(data.products);
        return res.status(201).json(createdProducts);
    } catch (error) {
        next(error);
    }
};

module.exports = { seedUser, seedProducts };
