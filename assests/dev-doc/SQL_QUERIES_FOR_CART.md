# SQL Queries to View Cart Items

## Basic Query - View All Cart Items

```sql
SELECT * FROM cart_items;
```

This shows:
- `id` - Cart item ID
- `user_id` - User ID who owns the cart item
- `product_id` - Product ID
- `quantity` - Quantity of product
- `created_at` - When item was added
- `updated_at` - Last updated time

## Detailed Query - Cart Items with Product Details

```sql
SELECT 
    ci.id AS cart_item_id,
    ci.quantity,
    ci.created_at,
    u.email AS user_email,
    u.name AS user_name,
    p.id AS product_id,
    p.name AS product_name,
    p.price,
    p.category_id,
    (p.price * ci.quantity) AS item_total
FROM cart_items ci
JOIN users u ON ci.user_id = u.id
JOIN products p ON ci.product_id = p.id
ORDER BY ci.created_at DESC;
```

This shows:
- Cart item details
- User who owns it
- Product name and price
- Total price for each item

## Query - Cart Items for Specific User

```sql
-- Replace 'your-email@example.com' with your actual email
SELECT 
    ci.id AS cart_item_id,
    ci.quantity,
    p.name AS product_name,
    p.price,
    (p.price * ci.quantity) AS subtotal,
    ci.created_at
FROM cart_items ci
JOIN users u ON ci.user_id = u.id
JOIN products p ON ci.product_id = p.id
WHERE u.email = 'your-email@example.com'
ORDER BY ci.created_at DESC;
```

## Query - Cart Summary (Total Items and Value)

```sql
SELECT 
    u.email,
    u.name,
    COUNT(ci.id) AS total_items,
    SUM(ci.quantity) AS total_quantity,
    SUM(p.price * ci.quantity) AS cart_total
FROM cart_items ci
JOIN users u ON ci.user_id = u.id
JOIN products p ON ci.product_id = p.id
GROUP BY u.id, u.email, u.name;
```

## Query - Check Your User ID

First, find your user ID:

```sql
SELECT id, email, name FROM users;
```

Then get cart items for that user:

```sql
-- Replace 1 with your actual user_id
SELECT 
    ci.id,
    ci.quantity,
    p.name AS product_name,
    p.price,
    ci.created_at
FROM cart_items ci
JOIN products p ON ci.product_id = p.id
WHERE ci.user_id = 1;
```

## Delete Cart Items (if needed)

```sql
-- Delete all cart items for a specific user (replace email)
DELETE FROM cart_items 
WHERE user_id = (SELECT id FROM users WHERE email = 'your-email@example.com');

-- Delete all cart items
DELETE FROM cart_items;

-- Delete a specific cart item by ID
DELETE FROM cart_items WHERE id = 1;
```

## Useful Queries for Debugging

### Check if tables exist
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('cart_items', 'users', 'products');
```

### Check table structure
```sql
\d cart_items
```

### Count records in each table
```sql
SELECT 
    (SELECT COUNT(*) FROM users) AS user_count,
    (SELECT COUNT(*) FROM products) AS product_count,
    (SELECT COUNT(*) FROM cart_items) AS cart_item_count;
```

## Expected Results

For 2 items in your cart, you should see:
- 2 rows in `SELECT * FROM cart_items;`
- Your email/name when joining with users table
- Product names and prices when joining with products table

Example output:
```
 cart_item_id | quantity | product_name                  | price  | subtotal | created_at
--------------+----------+-------------------------------+--------+----------+-------------------------
            1 |        1 | NovaFit Active Smartwatch     | 169.00 |   169.00 | 2025-11-29 10:30:15
            2 |        1 | Halo Comfort Headphones       | 219.00 |   219.00 | 2025-11-29 10:31:22
```

