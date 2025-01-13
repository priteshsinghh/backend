

const userSchema = `create table if not exists users (
userName varchar(255) not null,
email varchar(255) unique not null,
password varchar(255) 
)`;


module.exports = userSchema;