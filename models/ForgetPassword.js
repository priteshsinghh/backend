

const forgetPasswordSchema = `create table if not exists passwordReset (
email varchar(255),
token varchar(255)
)`


module.exports = forgetPasswordSchema;