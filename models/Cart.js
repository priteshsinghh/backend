const cartSchema = `create table if not exists cart_items (
    user_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (menuItem_id) REFERENCES menu_items(menuItem_id),
    UNIQUE KEY unique_cart_item (user_id, menuItem_id)
  )`;