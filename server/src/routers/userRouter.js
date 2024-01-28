const express = require("express");
const {
    handleGetAllUsers,
    handleGetUserById,
    handleDeleteUserById,
    handleProcessRegister,
    handleActivateUserAccount,
    handleUpdateUserById,
    handleManageUserBannedStatus,
    handleUpdateUserPassword,
    handleForgetPassword,
    handleResetPassword,
} = require("../controllers/userController");
const uploadUserImage = require("../middleware/fileUpload");
const {
    validateUserRegistration,
    validateUpdatePassword,
    validateForgetPassword,
    validateResetPassword,
} = require("../validators/auth");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middleware/auth");
const userRouter = express.Router();

userRouter.get("/", isLoggedIn, isAdmin, handleGetAllUsers);
userRouter.post(
    "/process-register",
    uploadUserImage.single("image"),
    isLoggedOut,
    validateUserRegistration,
    runValidation,
    handleProcessRegister
);
userRouter.post("/activate", isLoggedOut, handleActivateUserAccount);
userRouter.get("/:id", isLoggedIn, handleGetUserById);
userRouter.delete("/:id", isLoggedIn, handleDeleteUserById);
userRouter.put(
    "/update-user/:id",
    isLoggedIn,
    uploadUserImage.single("image"),
    handleUpdateUserById
);
userRouter.put(
    "/manage-user/:id",
    isLoggedIn,
    isAdmin,
    handleManageUserBannedStatus
);
userRouter.put(
    "/update-password/:id",
    isLoggedIn,
    validateUpdatePassword,
    runValidation,
    handleUpdateUserPassword
);
userRouter.post(
    "/forget-password",
    validateForgetPassword,
    runValidation,
    handleForgetPassword
);
userRouter.put(
    "/reset-password/:token",
    validateResetPassword,
    runValidation,
    handleResetPassword
);

module.exports = userRouter;
