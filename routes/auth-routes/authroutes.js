const express = require("express");
const multer = require("multer");
const { registerUser, loginUser } = require("../../controllers/auth/authcontroller");
const { addRegisterValidation, addLoginValidation } = require("../../validation/authValidation/authValidation")

const router = express.Router();


const {upload} = require("../../helpers/cloudinary") // Store file in memory as a buffer


router.post("/register", upload.single("profilePic"), addRegisterValidation, registerUser);
router.post("/login", addLoginValidation, loginUser);



module.exports = router;