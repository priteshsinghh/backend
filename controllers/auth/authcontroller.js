
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const { createTable, checkRecordExists, insertRecord } = require("../../utils/sqlFunctions");
const userSchema = require("../../models/user/User");
const mySqlPool = require("../../db/db");


const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, "CLIENT_SECRET_KEY", { expiresIn: "7d" });
};


//register controller

const registerUser = async (req, res) => {
    const { userName, email, password, phoneNumber, gender } = req.body;
    const profilePic = req.file ? req.file.buffer : null; // Handle profile_pic from multer

    try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = {
            userName,
            email,
            password: hashPassword,
            phoneNumber,
            gender,
            profilePic : profilePic,
        };

        // Create table and check if user exists
        await createTable(userSchema); 
        const userAlreadyExists = await checkRecordExists("users", ["email", "phoneNumber"] , [email, phoneNumber]);

        if (userAlreadyExists) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Insert new user
        await insertRecord("users", newUser);
        return res.status(201).json({ message: "User created successfully!" });
        
    } catch (error) {
        console.error("Error in registerUser:", error.message);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};



//login controller
const loginUser = async (req, res) => {
    const { email, phoneNumber, password } = req.body;

    if (!email && !phoneNumber || !password) {
        return res.status(400).json({
            error: "this fields can not be empty"

        });
        
    }

    try {

        const existingUser = await checkRecordExists("users", ["email", "phoneNumber"], [email, phoneNumber]);

        if (existingUser) {
            if (!existingUser.password) {
                res.status(401).json({ error: "Invalid credentials" });
                return;
            }

            const passwordMatch = await bcrypt.compare(
                password,
                existingUser.password
            );

            if (passwordMatch) {
                res.status(200).json({
                    userId: existingUser.userId,
                    email: existingUser.email,
                    phoneNumber : existingUser.phoneNumber,
                    gender : existingUser.gender,
                    profilePic : existingUser.profilePic
                    ? existingUser.profilePic.toString("base64") // Convert only if not null
                    : null, // Convert buffer to base64 for response
                    access_token: generateAccessToken(existingUser.userId),
                });
            } else {
                res.status(401).json({ error: "Invalid credentials" });
            }
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }


}








module.exports = { registerUser, loginUser };
