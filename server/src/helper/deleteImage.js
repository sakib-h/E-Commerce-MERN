const fs = require("fs").promises;
const deleteImage = async (userImagePath) => {
    try {
        await fs.access(userImagePath);
        await fs.unlink(userImagePath);
        console.log("User Image was deleted");
    } catch (error) {
        console.error("User Image does not exists");
    }
};
module.exports = { deleteImage };
