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
const { isLoggedIn, isLoggedOut } = require("../middleware/auth");
const userRouter = express.Router();

userRouter.get("/", isLoggedIn, getUsers);
userRouter.post(
    "/process-register",
    uploadUserImage.single("image"),
    isLoggedOut,
    validateUserRegistration,
    runValidation,
    processRegister
);
userRouter.post("/activate", isLoggedOut, activateUserAccount);
userRouter.get("/:id", isLoggedIn, getUserById);
userRouter.delete("/:id", isLoggedIn, deleteUserById);
userRouter.put(
    "/:id",
    uploadUserImage.single("image"),
    isLoggedIn,
    updateUserById
);

module.exports = userRouter;
