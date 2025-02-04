const express = require("express");
const { getProfile, editProfile, editProfilePicture } = require("../../controllers/home/profile-controller");

const router = express.Router();
const {upload} = require("../../helpers/cloudinary")



router.get("/get-profile", getProfile);
router.put("/edit-profile", editProfile);
router.post("/edit-profilepic", upload.single("profilePic"), editProfilePicture );



module.exports = router;


