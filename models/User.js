

const userSchema = `create table if not exists users (
    userName varchar(255) not null,
    email varchar(255) unique not null,
    phoneNumber varchar(15) unique not null,
    gender varchar(255),
    userRole varchar(255),
    isVerified boolean DEFAULT false,
    token varchar(255),
    profilePic varchar(500),
    password varchar(255)
  )`;

module.exports = userSchema;
