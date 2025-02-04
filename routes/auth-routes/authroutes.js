const express = require("express");
const { registerUser, loginUser, logoutUser, verifyEmail, forgetPassword, resetPasswordLoad, resetPassword } = require("../../controllers/auth/authcontroller");
const { addRegisterValidation, addLoginValidation } = require("../../validation/authValidation/authValidation")

const router = express.Router();


const {upload} = require("../../helpers/cloudinary") // Store file in memory as a buffer





router.post("/register", upload.single("profilePic"), addRegisterValidation, registerUser);
router.post("/login", addLoginValidation, loginUser);
router.post("/logout",logoutUser);
router.get("/mail-verification", verifyEmail);

router.post("/forget-password", forgetPassword);
router.get("/reset-password", resetPasswordLoad);
router.post("/reset-password", resetPassword);




module.exports = router;