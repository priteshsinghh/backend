
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const { createTable, checkRecordExists, insertRecord } = require("../../utils/sqlFunctions");
const userSchema = require("../../models/User");
const mySqlPool = require("../../db/db");
const randomstring = require("randomstring")
const { imageUpload } = require("../../helpers/cloudinary");

const { sendMail } = require("../../utils/sqlFunctions");


// const generateAccessToken = (userId) => {
//     return jwt.sign({ userId }, "CLIENT_SECRET_KEY", { expiresIn: "7d" });
// };


//register controller

const registerUser = async (req, res) => {
    const { userName, email, password, phoneNumber, gender, userRole, token, isVerified } = req.body;
    // const profilePic = req.file ? req.file.buffer : null; // Handle profile_pic from multer
    try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const profilePic = Buffer.from(req.file.buffer).toString("base64");
        const url = "data:" + req.file.mimetype + ";base64," + profilePic;

        const newUser = {
            userName,
            email,
            password: hashPassword,
            phoneNumber,
            gender,
            userRole,
            token,
            isVerified,
            profilePic: profilePic,
        };

        const result = await imageUpload(url);

        if (result && result.url) {
            newUser.profilePic = result.url;

        } else {

            throw new Error("Image uploaded failes: no url returned.")
        }

        // Create table and check if user exists
        await createTable(userSchema);
        const userAlreadyExists = await checkRecordExists("users", ["email", "phoneNumber"], [email, phoneNumber]);

        if (userAlreadyExists) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Insert new user
        await insertRecord("users", newUser);

        //send verification mail
        let mailSubject = "Verification Mail";
        const randomToken = randomstring.generate();
        const url1 = `http://localhost:5001/auth/mail-verification/${randomToken}`;
        let content = `please click this to link to verify <a href="${url1}">${url1}</a>`

        sendMail(email, mailSubject, content);

        mySqlPool.query('UPDATE users set token=? where email=?', [randomToken, email], function (error, result, fields) {
            if (error) {
                return res.status(400).json({
                    message: error.message
                })
            }
        });

        return res.status(201).json({ message: "User created successfully!" });

    } catch (error) {
        console.error("Error in registerUser:", error.message);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};


const verifyEmail = async (req, res) => {
    const token = req.params.token;

    console.log("Received token:", token);

    if (!token) {
        return res.status(400).json({ message: "Token is required" });
    }
    console.log("Executing query to find user with token:", token);
    

    mySqlPool.query('SELECT * FROM users WHERE token = ? LIMIT 1', [token],
        function (error, result) {
            console.log(result);

            if (error) {
                console.error("Database Error:", error);
                return res.status(500).json({ message: "Internal server error" });
            }

            if (result.length > 0) {
                const userId = result[0].email;
                console.log(userId);


                // Update user's verification status
                mySqlPool.query('UPDATE users SET token = NULL, isVerified = 1 WHERE email = ?', [email], function (updateError) {
                    if (updateError) {
                        console.error("Update Error:", updateError);
                        return res.status(500).json({ message: "Failed to update user" });
                    }

                    console.log("User verified successfully");
                    return res.render("email-verified", { message: "Verified successfully" });
                });
            } else {
                console.log("Invalid token, no user found");
                return res.render('404');
            }
        });
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

            if (!passwordMatch) return res.json({
                success: false,
                message: "Invalid Credentials"
            });

            const token = jwt.sign({
                Id: existingUser._id,
                email: existingUser.email,
                phoneNumber: existingUser.phoneNumber,
                gender: existingUser.gender,
                userRole: existingUser.userRole,
                profilePic: existingUser.profilePic,
            }, 'CLIENT_SECRET_KEY', { expiresIn: '7d' })

            res.cookie('token', token, { httpOnly: true, secure: false }).json({
                success: true,
                message: "Logged in Successfully",
                user: {
                    email: existingUser.email,
                    phoneNumber: existingUser.phoneNumber,
                    userRole: existingUser.userRole,
                    Id: existingUser._id,
                },
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }


}


//logout

const logoutUser = (req, res) => {
    res.clearCookie('token').json({
        success: true,
        message: "logout Successfully"
    });
};



//auth middleware

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    console.log(token);

    if (!token) return res.json({
        success: false,
        message: "Unauthorize user !"
    })
    try {

        const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
        req.user = decoded;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            success: false,
            message: "Some Error Occured"
        })

    }
}




module.exports = { registerUser, loginUser, authMiddleware, logoutUser, verifyEmail };
