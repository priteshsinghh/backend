const express = require("express");
const path = require("path")
const { registerUser, loginUser, authMiddleware, logoutUser, verifyEmail } = require("../../controllers/auth/authcontroller");
const { addRegisterValidation, addLoginValidation } = require("../../validation/authValidation/authValidation")

const router = express();


const {upload} = require("../../helpers/cloudinary") // Store file in memory as a buffer


router.set('view engine', 'ejs');
router.set('views', path.join(__dirname, 'views'));


router.post("/register", upload.single("profilePic"), addRegisterValidation, registerUser);
router.post("/login", addLoginValidation, loginUser);
router.post("/logout",logoutUser);
router.get("/mail-verification/:token", verifyEmail);


router.get("/check-auth", authMiddleware, (req,res)=>{
    const user = req.user;
    res.status(200).json({
        success : true,
        message: "Authenticated user",
        user,
    });
});



module.exports = router;