const express = require("express");
const path = require("path")
const { registerUser, loginUser, authMiddleware, logoutUser, verifyEmail, forgetPassword, resetPasswordLoad, resetPassword } = require("../../controllers/auth/authcontroller");
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


router.get("/check-auth", authMiddleware, (req,res)=>{
    const user = req.user;
    res.status(200).json({
        success : true,
        message: "Authenticated user",
        user,
    });
});



module.exports = router;