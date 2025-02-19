

const express = require("express")
const { upload } = require("../../helpers/cloudinary");
const { addRestaurant, getRestaurants, getRestaurantsById, deleteRestaurantById, addCategory, addMenuItem, fetchcategoryById, fetchMenu, editMenu, deleteMenuCategory, deleteMenuItem } = require("../../controllers/seller/restaurant-controller");

const router = express.Router();


router.post("/add-restaurant", upload.single("image"), addRestaurant);
router.get("/fetch-restaurant", getRestaurants);
router.get("/get-restaurant", getRestaurantsById);
router.delete("/delete-restaurant", deleteRestaurantById);


router.post("/add-category", addCategory);
router.get("/fetch-category", fetchcategoryById);
router.delete("/delete-category", deleteMenuCategory);
router.post("/add-menuItem", upload.single("image"), addMenuItem);
router.get("/fetch-menu", fetchMenu);
router.put("/edit-menu", upload.single("image"), editMenu);
router.delete("/delete-menu", deleteMenuItem);




module.exports = router;