const express = require("express");
const {handleImageUpload, addProduct} = require("../../controllers/admin/product-controller")


const { upload } = require("../../helpers/cloudinary");


const router = express.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addProduct);


module.exports = router;