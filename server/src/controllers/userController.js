const users = [
    {
        id: 1,
        name: "Jane",
    },
    {
        id: 2,
        name: "John",
    },
    {
        id: 3,
        name: "Jim",
    },
];

const getUsers = (req, res) => {
    res.status(200).send({
        message: "User Profile is Returned",
        users,
    });
};

module.exports = { getUsers };
