
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs")
const { createTable, checkRecordExists, insertRecord } = require("../../utils/sqlFunctions");
const userSchema = require("../../models/User");
const mySqlPool = require("../../db/db");
const forgetPasswordSchema = require("../../models/ForgetPassword");
const randomstring = require("randomstring")
const { imageUpload } = require("../../helpers/cloudinary");
const { sendMail } = require("../../utils/sqlFunctions");



//register controller

const registerUser = async (req, res) => {
    const { userName, email, password, phoneNumber, gender, userRole, isVerified } = req.body;
   
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
        const mailSubject = "Verification Mail";
        const randomToken = jwt.sign({ email }, 'CLIENT_SECRET_KEY', { expiresIn: '5m' })

        const content = 'Hello ' + userName + ', Please Click <a href="http://localhost:5173/auth/mail-verification?token=' + randomToken + '&phoneNumber=' + phoneNumber + '">Verify</a> to verify your email'

        sendMail(email, mailSubject, content);

        return res.status(201).json({
            status: "ok",
            message: "User created successfully!"
        });

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

            if (existingUser.isVerified !== 1) {
                return res.status(401).json({
                    error: "Please verify your email to log in"
                });
            }

            if (!existingUser.password) {
                res.status(401).json({ error: "Invalid credentials or need to verify your email" });
                return;
            }

            const passwordMatch = await bcrypt.compare(
                password,
                existingUser.password
            );

            if (!passwordMatch) return res.json({
                success: false,
                message: "Invalid Credentials please write it correct"
            });

            const token = jwt.sign({
                email: existingUser.email,
                phoneNumber: existingUser.phoneNumber,
                gender: existingUser.gender,
                userRole: existingUser.userRole,
                profilePic: existingUser.profilePic,
            }, 'CLIENT_SECRET_KEY', { expiresIn: '60m' })

            
            if (res.status(201)) {
                return res.json({
                    status: "ok",
                    data: {
                        token: token,
                        userRole: existingUser.userRole,
                    }
                });
            } else {
                return res.json({ error: "error" });
            }
        }

        res.json({
            status: "error",
            error: "user no exist"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


//verify email

const verifyEmail = async (req, res) => {
    const token = req.query.token;
    const phoneNumber = req.query.token;

    try {
        // Decode JWT

        const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
        const email = decoded.email;

        const existingUser = await checkRecordExists("users", ["email", "phoneNumber"], [email, phoneNumber]);

        if (existingUser.isVerified === 1) {
            return res.status(200).json({
                success: false,
                message: 'Invalid email or already verified.'
            });
        }
        // Update isVerified
        const [result] = await mySqlPool.query('UPDATE users SET isVerified = true WHERE email = ?', [email]);

        if (result.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or already verified.'
            });
        } else {
            res.status(200).json({
                success: true,
                message: 'Email verified successfully.'
            });
        }

    } catch (err) {
        res.status(400).json({
            success: false,
            err: 'Invalid or expired token.'
        });
    }
};



//forget Password
const forgetPassword = async (req, res) => {

    try {

        const { email } = req.body;
        console.log(req.body);


        if (!email) {
            return res.status(400).json({
                success: false,
                message: "email is required",
            })
        }

        await createTable(forgetPasswordSchema);

        const [result] = await mySqlPool.query('SELECT * FROM users WHERE email = ?   LIMIT 1', [email]);

        if (result.length > 0) {
            const randomString = randomstring.generate();
            console.log(randomString);


            const newData = {
                email: result[0].email,
                token: randomString,
            }

            const userName = result[0].userName;
            const mailSubject = "Password reset";
            const content = 'Hello ' + userName + ', Please <a href="http://localhost:5173/auth/reset-password?token=' + randomString + '">Click Here</a> to reset your password'

            sendMail(email, mailSubject, content);

            await mySqlPool.query('delete from passwordReset where email = ?', email)
            insertRecord("passwordReset", newData);
            console.log("data upload successfully");
            return res.status(200).json({
                success: true,
                message: "mail sent successfully"
            })

        } else {
            console.log("Invalid email, no user found");
            return res.status(401).json({
                success: false,
                message: "Invalid email, no user found"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "some error occured",
        })

    }



}


const resetPasswordLoad = async (req, res) => {
    const token = req.query.token;

    console.log(req.query);

    if (!token) {
        return res.status(400).json({ message: "Token is required" });
    }

    const [result] = await mySqlPool.query('select * from passwordReset where token = ? limit 1', token);

    if (result.length > 0) {
        const email = result[0].email;
        const phoneNumber = result[0].phoneNumber;

        await mySqlPool.query('select * from users where email = ? AND phoneNumber = ?', email, phoneNumber);

        return res.status(200).json({
            success: true,
            message: "Valid token and user found",
            data: {
                email: email,
                phoneNumber: phoneNumber,
            },
        });


    } else {
        console.log("Invalid token, no user found");
        return res.status(401).json({
            success: false,
            message: "failed"
        })

    }
}



const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Validate the token and phone number
        const [result] = await mySqlPool.query(
            'SELECT * FROM passwordReset WHERE token = ? LIMIT 1',
            [token]
        );

        if (result.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid token or phone number',
            });
        }

        const email = result[0].email;

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        await mySqlPool.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

        // Delete the token entry to prevent reuse
        await mySqlPool.query('DELETE FROM passwordReset WHERE email = ?', [email]);

        return res.status(200).json({
            success: true,
            message: 'Password reset successfully',
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to reset password. Please try again later.',
        });
    }
};




//logout

const logoutUser = () => {
    localStorage.clear();
};



module.exports = { registerUser, loginUser, logoutUser, verifyEmail, forgetPassword, resetPasswordLoad, resetPassword };
