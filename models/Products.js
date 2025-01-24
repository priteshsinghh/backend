


const productSchema = `create table if not exists products (
image varchar(255),
title varchar(255),
description varchar(255),
category varchar(255),
price int(15)
)`;


module.exports = productSchema;


