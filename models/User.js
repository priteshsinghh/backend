

const userSchema = `create table if not exists users (
    user_id varchar(255) PRIMARY KEY,
    userName varchar(255) not null,
    email varchar(255) unique not null,
    phoneNumber varchar(15) unique not null,
    gender varchar(255),
    userRole varchar(255),
    isVerified boolean DEFAULT false,
    profilePic varchar(500),
    password varchar(255)
  )`;

module.exports = userSchema;
