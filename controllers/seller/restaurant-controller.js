const { imageUpload } = require("../../helpers/cloudinary");
const restaurantSchema = require("../../models/Restaurant");
const { createTable, insertRecord, checkRecordExists } = require("../../utils/sqlFunctions");
const db = require("../../db/db")





const addRestaurant = async (req, res) => {
    try {
        const {
            restaurantName,
            description,
            address,
            contactDetails,
            openingHour,
            closingHour,
            cuisineType,
            deliveryFee,
        } = req.body;

        const image = Buffer.from(req.file.buffer).toString("base64");
        const imageUrl = `data:${req.file.mimetype};base64,${image}`;

        // Upload image and get the URL
        const result = await imageUpload(imageUrl);
        if (!result || !result.url) {
            throw new Error("Image upload failed: No URL returned.");
        }

        const newRestaurant = {
            restaurantName,
            description,
            address,
            contactDetails,
            openingHour,
            closingHour,
            cuisineType,
            deliveryFee,
            image: result.url
        };

        await createTable(restaurantSchema);
        const recordExist = await checkRecordExists("restaurant", ["restaurantName", "address"], [restaurantName, address]);
        if (recordExist) {
            return res.status(409).json({
                success: false,
                message: "Restaurant already exists"
            });
        }

        await insertRecord("restaurant", newRestaurant);

        return res.status(201).json({
            success: true,
            message: "Restaurant Added Successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Some error occured"
        })

    }
}



//fetch restaurant
const getRestaurants = async (req, res) => {
    try {
        const [restaurants] = await db.query("SELECT * FROM restaurant");

        res.status(200).json({
            success: true,
            message: "Reasturant Found Successfully",
            restaurants
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false, message: "Error fetching restaurants"
        });
    }
};




module.exports = { addRestaurant, getRestaurants };