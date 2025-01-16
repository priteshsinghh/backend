

const userSchema = `create table if not exists users (
userName varchar(255) not null,
email varchar(255) unique not null,
phoneNumber char(10),
gender varchar(255),
password varchar(255)
)`;


module.exports = userSchema;