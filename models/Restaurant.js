

const restaurantSchema = `create table if not exists restaurant (
    restaurantName varchar(255) unique not null,
    description varchar(255) not null,
    address varchar(255),
    contactDetails varchar(255),
    openingHour varchar(255),
    closingHour varchar(255),
    cuisineType varchar(255),
    deliveryFee varchar(255),
    image varchar(255)
  )`;

module.exports = restaurantSchema;