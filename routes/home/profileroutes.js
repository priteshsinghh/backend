const express = require("express");
const { getProfile } = require("../../controllers/home/profile-controller");

const router = express.Router();



router.get("/get-user", getProfile);



module.exports = router;


