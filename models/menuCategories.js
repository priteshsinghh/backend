


const menuCategoriesSchema = `CREATE TABLE if not exists menu_categories (
    category_id varchar(255) PRIMARY KEY,
    restaurant_id varchar(255),
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id) ON DELETE CASCADE
)`;

module.exports = menuCategoriesSchema;

