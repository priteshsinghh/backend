const jwt = require("jsonwebtoken");

const db = require("../../db/db")


const getProfile = async(req,res) => {
    try {
        
        const token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
        const email = decoded.email;

        const [result] = await db.query("select * from users where email = ?", [email]);

        if(result.length > 0){
            console.log(result);
            return res.status(200).json({
                success: true,
                data: result,
                message: "User found Successfully"
            })
            
        }

        

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "some error occured"
        })
        
    }
}



module.exports = {getProfile}