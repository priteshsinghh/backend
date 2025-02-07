

const express = require("express")
const { upload } = require("../../helpers/cloudinary");
const { addRestaurant, getRestaurants } = require("../../controllers/seller/restaurant-controller");

const router = express.Router();


router.post("/add-restaurant", upload.single("image"), addRestaurant);
router.get("/get-restaurant", getRestaurants);




module.exports = router;