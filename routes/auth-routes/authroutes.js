const express = require("express");
const { registerUser, loginUser, authMiddleware, logoutUser } = require("../../controllers/auth/authcontroller");
const { addRegisterValidation, addLoginValidation } = require("../../validation/authValidation/authValidation")

const router = express.Router();


const {upload} = require("../../helpers/cloudinary") // Store file in memory as a buffer


router.post("/register", upload.single("profilePic"), addRegisterValidation, registerUser);
router.post("/login", addLoginValidation, loginUser);
router.post("/logout",logoutUser);
router.get("/check-auth", authMiddleware, (req,res)=>{
    const user = req.user;
    res.status(200).json({
        success : true,
        message: "Authenticated user",
        user,
    });
});



module.exports = router;