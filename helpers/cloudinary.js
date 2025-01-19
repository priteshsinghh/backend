const cloudinary = require("cloudinary");
const multer = require("multer");


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});


const storage = new multer.memoryStorage();

async function imageUpload(file) {
    const result = await cloudinary.uploader.upload(file, {
        resourse_type: "auto",
    })

    return result;
}

const upload = multer({storage});

module.exports = {upload, imageUpload};

