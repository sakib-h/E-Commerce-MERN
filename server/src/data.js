const data = {
    users: [
        {
            name: "Sakib Hasan",
            email: "sakib100.sa@gmail.com",
            password: "Sakib@14168",
            phone: "01700000000",
            address: "Dhaka, Bangladesh",
            // image: "public/images/users/default-user.png",
            isAdmin: true,
        },
        {
            name: "Tanvir Ahmed",
            email: "tanvir@gmail.com",
            password: "Sakib@14168",
            phone: "01700000000",
            address: "Dhaka, Bangladesh",
            image: "public/images/users/default-user.png",
            isAdmin: false,
        },
        {
            name: "Shakil Ahmed",
            email: "sakilahmed@gmail.com",
            password: "Sakib@14168",
            phone: "01700000000",
            address: "Dhaka, Bangladesh",
            image: "public/images/users/default-user.png",
            isAdmin: false,
        },
        {
            name: "Shamim Haque",
            email: "shamim@gmail.com",
            password: "Sakib@14168",
            phone: "01700000000",
            address: "Dhaka, Bangladesh",
            image: "public/images/users/default-user.png",
            isAdmin: false,
        },
    ],
    products: [
        {
            name: "iPhone 14 Pro Max",
            slug: "iphone-14-pro-max",
            description:
                "The iPhone 14 Pro Max is the most advanced iPhone ever. It features the largest display ever on an iPhone, a new A16 Bionic chip, and Pro camera system with 10-bit Dolby Vision HDR recording.",
            price: 1999.99,
            quantity: 100,
            sold: 0,
            shipping: 100,
            image: "public/images/products/iphone-14-pro-max.jpg",
            category: "Electronics",
        },
    ],
};

module.exports = data;
