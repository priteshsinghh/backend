

const forgetPasswordSchema = `create table if not exists passwordReset (
email varchar(255),
token varchar(255),
phoneNumber varchar(15)
)`


module.exports = forgetPasswordSchema;