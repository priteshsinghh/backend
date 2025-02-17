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
        // const recordExist = await checkRecordExists("restaurant", ["restaurantName", "address"], [restaurantName, address]);
        const [recordExist] = await db.query("select * from restaurant where restaurantName = ? and address = ?", [restaurantName, address]);
        if (recordExist.length > 0) {
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
    // console.log("id:", id);

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
        // console.log(id);

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

        const [recordExist] = await db.query("select * from menu_categories where name= ? and restaurant_id=? ", [name, restaurant_id]);
        if (recordExist.length > 0) {
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


const fetchcategoryById = async (req, res) => {
    try {

        const id = req.query.id;
        // console.log("id:1",id); 

        const [categories] = await db.query("SELECT * FROM menu_categories where restaurant_id = ?", [id]);

        res.status(200).json({
            success: true,
            message: "Reasturant Found Successfully",
            categories
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "some error occured"
        })

    }
}

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

        console.log(req.body);

        if (!restaurant_id || !category_id || !name || !price) {
            return res.status(400).json({
                success: false,
                message: "Empty fields are not allowed"
            });
        }

        let imageUrl = null;

        // Check if an image file is provided in the request
        if (req.file) {
            const image = Buffer.from(req.file.buffer).toString("base64");
            imageUrl = `data:${req.file.mimetype};base64,${image}`;

            // Upload image and get the URL
            const result = await imageUpload(imageUrl);
            if (!result || !result.url) {
                throw new Error("Image upload failed: No URL returned.");
            }
            imageUrl = result.url; // Save the URL from the upload
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
            image: imageUrl // The image will be null if not provided
        }

        await createTable(menuItemSchema);

        // const recordExist = await checkRecordExists("menu_items", ["name", "menuItem_id"], [name, randomstring]);
        const [recordExist] = await db.query("select * from menu_items where name =? and category_id = ?", [name, category_id]);

        if (recordExist.length > 0) {
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


const fetchMenu = async (req, res) => {

    try {
        const restaurantId = req.query.id;
        // const {restaurantId} = req.body;

        if (!restaurantId) {
            return res.status(400).json({
                success: false,
                message: "Restaurant Id not found"
            })
        }

        const [categories] = await db.query("select * from menu_categories where restaurant_id = ? ", [restaurantId])

        if (categories.length === 0) {
            return res.status(200).json({
                success: true,
                message: "found",
                categories: []
            })
        }

        for (const category of categories) {

            const [menuItems] = await db.query("select * from menu_items where category_id = ? ", [category.category_id]);
            category.menu_items = menuItems;
        }
        return res.status(200).json({
            success: true,
            message: "Found Menu",
            categories
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Some error occured"
        })

    }
}


const editMenu = async (req, res) => {
    try {

        const id = req.query.id;

        const {
            name,
            description,
            price,
            quantity
        } = req.body;

        console.log(id);


        let imageUrl = null;

        if (req.file) {
            const image = Buffer.from(req.file.buffer).toString("base64");
            imageUrl = `data:${req.file.mimetype};base64,${image}`;

            const result = await imageUpload(imageUrl);
            if (!result || !result.url) {
                throw new Error("Image upload failed: No URL returned.");
            }
            imageUrl = result.url; // Save the URL from the upload
        }

        const [categories] = await db.query("select * from menu_categories where restaurant_id = ? ", [id])

        if (categories.length === 0) {
            return res.status(200).json({
                success: true,
                message: "found",
                categories: []
            })
        }
        // console.log(categories);

        for (const category of categories) {

            console.log("category id", category.menuItems);
            

            // const [recordExist] = await db.query("select * from menu_items where name = ? and category_id != ? ", [name, category.menuItems]);

            // if(recordExist){
            //     return res.status(409).json({
            //         success: false,
            //         message: "Record already exist"
            //     })
            // }
            
            const [menuItems] = await db.query("update menu_items set name = ?, description = ?, price = ?, quantity = ?, image = ? where category_id = ? ", [name, description, price, quantity, imageUrl, category.category_id]);
            category.menu_items = menuItems;


            const [items] = await db.query("select * from menu_items where category_id = ?", category.category_id);
            console.log(items);
            category.menu_items = items;
        }
        return res.status(200).json({
            success: true,
            message: "Menu Edited Successfully",
            categories
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Some Error Occured"
        })

    }
}




module.exports = { addRestaurant, getRestaurants, getRestaurantsById, deleteRestaurantById, addCategory, addMenuItem, fetchcategoryById, fetchMenu, editMenu };