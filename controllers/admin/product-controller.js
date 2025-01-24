const { imageUpload } = require("../../helpers/cloudinary");
const productSchema = require("../../models/Products");
const { createTable, insertRecord, checkRecordExists } = require("../../utils/sqlFunctions");




const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await imageUpload(url);

    // Check if the imageUploadUtil call was successful
    if (result && result.url) {
      res.json({
        success: true,
        result,  // Return the result for debugging
      });
    } else {
      // If result doesn't contain expected data, handle this case
      throw new Error("Image upload failed: No URL returned.");
    }

  } catch (error) {
    console.log("Error during image upload:", error);  // More detailed logging
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred during image upload",  // Send error details back to frontend
    });
  }
};



//add new products 
const addProduct = async (req, res) => {
  try {

    const { image, title, description, category, price } = req.body;

    console.log("reqBody", req.body);


    const newlyCreatedProduct = ({
      image,
      title,
      description,
      category,
      price,
    });

    await createTable(productSchema);

    await insertRecord("products", newlyCreatedProduct);
    return res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
      message: "Product uploaded successfully!"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "some error occured"
    })

  }
}






//fetch products
const fetchProduct = async (req, res) => {
  try {

    const ListProduct = await checkRecordExists("products");
    res.status(200).json({
      success: true,
      data: ListProduct,
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "some error occured"
    })

  }
}

//eidt product

const editProduct = async (req, res) => {
  try {

    const { id } = req.params;
    const { image, title, description, category, price } = req.body;

    let findProduct = await checkRecordExists("products", "id", id);
    if (!findProduct) return (404).json({
      success: false,
      message: "Product not found",
    });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.image = image || findProduct.image;

    await insertRecord(findProduct);
    res.status(200).json({
      success: true,
      data: findProduct,
    });



  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "some error occured"
    })

  }
}


//delete product

const deleteProduct = async (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "some error occured"
    })

  }
}




module.exports = { handleImageUpload, addProduct, fetchProduct, editProduct, deleteProduct };