const express = require("express");
const {
    getUsers,
    getUserById,
    deleteUserById,
    processRegister,
    activateUserAccount,
    updateUserById,
} = require("../controllers/userController");
const uploadUserImage = require("../middleware/fileUpload");
const { validateUserRegistration } = require("../validators/auth");
const runValidation = require("../validators");
const { isLoggedIn } = require("../middleware/auth");
const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.post(
    "/process-register",
    uploadUserImage.single("image"),
    validateUserRegistration,
    runValidation,
    processRegister
);
userRouter.post("/activate", activateUserAccount);
userRouter.get("/:id", isLoggedIn, getUserById);
userRouter.delete("/:id", deleteUserById);
userRouter.put("/:id", uploadUserImage.single("image"), updateUserById);

module.exports = userRouter;
