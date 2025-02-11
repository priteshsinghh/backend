

const express = require("express")
const { upload } = require("../../helpers/cloudinary");
const { addRestaurant, getRestaurants, getRestaurantsById, deleteRestaurantById, addCategory, addMenuItem, fetchcategoryById } = require("../../controllers/seller/restaurant-controller");

const router = express.Router();


router.post("/add-restaurant", upload.single("image"), addRestaurant);
router.get("/fetch-restaurant", getRestaurants);
router.get("/get-restaurant", getRestaurantsById);
router.delete("/delete-restaurant", deleteRestaurantById);


router.post("/add-category", addCategory);
router.get("/fetch-category", fetchcategoryById);
router.post("/add-menuItem", upload.single("image"), addMenuItem);




module.exports = router;