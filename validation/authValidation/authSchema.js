const joi = require("@hapi/joi")


const schema = {
    register : joi.object({
        userName : joi.string().max(100).required(),
        email : joi.string().email().required(),
        phoneNumber: joi.number().integer().min(1000000000).message("Invalid mobile number").max(9999999999).message("Invalid mobile number").required(),
        gender : joi.string().valid("male","female","other").required(),
        userRole : joi.string().valid("seller","buyer").required(),
        password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    }),

    login : joi.object({
        email : joi.string().email(),
        phoneNumber: joi.number().integer().min(1000000000).message("Invalid mobile number").max(9999999999).message("Invalid mobile number"),
        password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required()
    })
}

module.exports = schema;