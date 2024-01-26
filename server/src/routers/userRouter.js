const express = require("express");
const {
    getAllUsers,
    getUserById,
    deleteUserById,
    processRegister,
    activateUserAccount,
    updateUserById,
    manageUserBannedStatus,
    updateUserPassword,
    forgetPassword,
} = require("../controllers/userController");
const uploadUserImage = require("../middleware/fileUpload");
const {
    validateUserRegistration,
    validateUpdatePassword,
    validateForgetPassword,
} = require("../validators/auth");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleware/auth");
const userRouter = express.Router();

userRouter.get("/", isLoggedIn, isAdmin, getAllUsers);
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
    isLoggedIn,
    uploadUserImage.single("image"),
    updateUserById
);
userRouter.put("/manage-user/:id", isLoggedIn, isAdmin, manageUserBannedStatus);
userRouter.put(
    "/update-password/:id",
    isLoggedIn,
    validateUpdatePassword,
    runValidation,
    updateUserPassword
);
userRouter.post(
    "/forget-password",
    validateForgetPassword,
    runValidation,
    forgetPassword
);

module.exports = userRouter;
