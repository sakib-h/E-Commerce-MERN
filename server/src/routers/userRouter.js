const express = require("express");
const {
    getUsers,
    getUserById,
    deleteUserById,
    processRegister,
    activateUserAccount,
    updateUserById,
    bannedUserById,
    unBannedUserById,
} = require("../controllers/userController");
const uploadUserImage = require("../middleware/fileUpload");
const { validateUserRegistration } = require("../validators/auth");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleware/auth");
const userRouter = express.Router();

userRouter.get("/", isLoggedIn, isAdmin, getUsers);
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
userRouter.put("/banned-user/:id", isLoggedIn, isAdmin, bannedUserById);
userRouter.put("/unbanned-user/:id", isLoggedIn, isAdmin, unBannedUserById);

module.exports = userRouter;
