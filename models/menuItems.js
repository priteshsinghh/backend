

const menuItemSchema = `CREATE TABLE if not exists menu_items (
    menuItem_id varchar(255) PRIMARY KEY,
    restaurant_id varchar(255),
    category_id varchar(255),
    name VARCHAR(255) NOT NULL,
    description varchar(255),
    price DECIMAL(10,2),
    quantity varchar(255),
    image VARCHAR(255),
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES menu_categories(category_id) ON DELETE CASCADE
)`;


module.exports = menuItemSchema;
