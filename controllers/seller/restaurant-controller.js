const { imageUpload } = require("../../helpers/cloudinary");
const restaurantSchema = require("../../models/Restaurant");
const randomString = require("randomstring")
const { createTable, insertRecord, checkRecordExists } = require("../../utils/sqlFunctions");
const db = require("../../db/db");
const menuItemSchema = require("../../models/menuItems");
const menuCategoriesSchema = require("../../models/menuCategories");





//add restaurant
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

        const randomstring = randomString.generate();

        const newRestaurant = {
            restaurant_id: randomstring,
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


//fetch by Id
const getRestaurantsById = async (req, res) => {

    const id = req.query.id;
    console.log("id:", id);

    try {

        const [restaurants] = await db.query("SELECT * FROM restaurant where restaurant_id = ?", [id]);

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



//delete
const deleteRestaurantById = async (req, res) => {
    try {

        const id = req.query.id;
        console.log(id);

        if (id) {
            await db.query("delete from restaurant where restaurant_id = ?", [id]);
        }

        return res.status(200).json({
            success: true,
            message: "Restaurant Deleted Successfully"
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "some error occured"
        })

    }
}



// Add a new category
const addCategory = async (req, res) => {

    try {
        const { restaurant_id, name } = req.body;

        if (!restaurant_id || !name) {
            return res.status(400).json({
                success: false,
                message: "Restaurant ID and category name are required"
            });
        }

        const randomstring = randomString.generate();
        const newCategory = {
            category_id: randomstring,
            name,
            restaurant_id
        }
        await createTable(menuCategoriesSchema);


        const recordExist = await checkRecordExists("menu_categories", ["category_id", "name"], [randomstring, name]);

        if (recordExist) {
            return res.status(409).json({
                success: false,
                message: "category Already Exist"
            })
        }

        await insertRecord("menu_categories", newCategory);
        
        res.status(201).json({
            success: true,
            message: "Category added successfully"
        });

    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({
            success: false,
            message: "Error adding category"
        });
    }
};

//  menu item
const addMenuItem = async (req, res) => {

    try {
        const {
            restaurant_id,
            category_id,
            name,
            description,
            price,
            quantity,
        } = req.body;

        if (!restaurant_id || !category_id || !name || !price || !quantity) {
            return res.status(400).json({ success: false, message: "Restaurant ID, category ID, item name, and price are required" });
        }

        const image = Buffer.from(req.file.buffer).toString("base64");
        const imageUrl = `data:${req.file.mimetype};base64,${image}`;

        // Upload image and get the URL
        const result = await imageUpload(imageUrl);
        if (!result || !result.url) {
            throw new Error("Image upload failed: No URL returned.");
        }

        const randomstring = randomString.generate();

        const newMenuItem = {
            restaurant_id,
            category_id,
            menuItem_id: randomstring,
            name,
            description,
            price,
            quantity,
            image: result.url
        }

        await createTable(menuItemSchema);

        const recordExist = await checkRecordExists("menu_items", ["name", "menuItem_id"], [name, randomstring]);

        if (recordExist) {
            return res.status(409).json({
                success: false,
                message: "Item is already added"
            })
        }

        await insertRecord("menu_items", newMenuItem);

        res.status(201).json({
            success: true,
            message: "Menu item added successfully"
        });
    } catch (error) {
        console.error("Error adding menu item:", error);
        res.status(500).json({
            success: false,
            message: "Error adding menu item"
        });
    }
};




module.exports = { addRestaurant, getRestaurants, getRestaurantsById, deleteRestaurantById, addCategory, addMenuItem };