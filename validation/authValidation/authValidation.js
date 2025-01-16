const { login, register } = require("./authSchema");



const addRegisterValidation = async (req, res, next) => {
    const value = await register.validate(req.body);
    if (value.error) {
        res.json({
            success: 0,
            message: value.error.details[0].message
        })
    } else {
        next();
    }
}


const addLoginValidation = async (req, res, next) => {
    const value = await login.validate(req.body);
    if (value.error) {
        res.json({
            success: 0,
            message: value.error.details[0].message
        })
    } else {
        next();
    }
}



module.exports = { addRegisterValidation, addLoginValidation};


