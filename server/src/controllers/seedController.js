const data = require("../data");
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

module.exports = { seedUser };
