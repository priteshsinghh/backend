const db = require("../../db/db");
const bcrypt = require("bcryptjs")
const { imageUpload } = require("../../helpers/cloudinary");


const getProfile = async (req, res) => {
    try {
        const email = req.query.email;
        console.log(email);


        if (!email) {
            return res.status(400).json({
                success: false,
                message: "email not found"
            })
        }

        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (users.length > 0) {
            const user = users[0];
            return res.status(200).json({
                success: true,
                user,
                message: "User found successfully"
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An error occurred"
        });
    }
};



const editProfile = async (req, res) => {

    try {

        const email = req.query.email;
        console.log(email);


        if (!email) {
            return res.status(400).json({
                success: false,
                message: "email not found"
            })
        }

        const {
            userName,
            phoneNumber,
            gender,
        } = req.body;

        const [result] = await db.query('select * from users where email = ?', [email])

        if (result.length > 0) {

            await db.query('update users set username = ?, phoneNumber = ?, gender = ? where email = ?  ', [userName, phoneNumber, gender, email])

            return res.status(200).json({
                success: true,
                message: "Profile Updated Successfully"
            })

        } else {
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Some Error Occured"
        })

    }
}

const editProfilePicture = async (req, res) => {
    try {

        const email = req.body.email;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email not found",
            });
        }

        // Convert image to Base64
        const profilePic = Buffer.from(req.file.buffer).toString("base64");
        const imageUrl = `data:${req.file.mimetype};base64,${profilePic}`;

        // Upload image and get the URL
        const result = await imageUpload(imageUrl);
        if (!result || !result.url) {
            throw new Error("Image upload failed: No URL returned.");
        }

        // Update profilePic in database
        await db.query("UPDATE users SET profilePic = ? WHERE email = ?", [result.url, email]);

        return res.status(200).json({
            success: true,
            profilePic: result.url,
            message: "Profile Image uploaded successfully",
        });
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        return res.status(500).json({
            success: false,
            message: "Some error occurred",
        });
    }
};


const changePassword = async (req, res) => {
    try {

        const { currentPassword, newPassword, confirmPassword } = req.body;
        const email = req.query.email;
        
        if (!currentPassword || !newPassword || !confirmPassword || !email) {
            return res.status(400).json({
                success: false,
                message: "fields not found"
            })
        }

        if(newPassword !== confirmPassword){
            return res.json({
                success: false,
                message: "Password does not matched"
            })
        }

        const [users] = await db.query('select * from users where email = ?', [email]);

        if (users.length > 0) {

            const user = users[0];
            
            const passwordMatch = await bcrypt.compare(
                currentPassword,
                user.password
            );

            if (!passwordMatch) return res.json({
                success: false,
                message: "Wrong Old password"
            });

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(newPassword, salt);

            await db.query('update users set password = ? where email = ?', [hashPassword, email])

            return res.status(200).json({
                success: true,
                message: "Password Changed Successfully"
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "some error occured"
        })

    }
}

module.exports = { getProfile, editProfile, editProfilePicture, changePassword }