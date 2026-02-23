-- Seed Data for Crums O Bliss

-- Optional: Delete existing data to avoid conflicts (Warning: this will cascade delete orders, etc.)
-- TRUNCATE public.products, public.custom_catalogues, public.orders CASCADE;

-- 1. Seed Products
INSERT INTO public.products (id, name, description, price, stock, image_url, category, view_count, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Margherita Pizza', 'Classic delight with 100% real mozzarella cheese.', 299, 50, '/assets/pizza.jpg', 'Pizza', 120, true),
  ('22222222-2222-2222-2222-222222222222', 'Pepperoni Pizza', 'Double pepperonis and double cheese.', 399, 40, '/assets/pizza.jpg', 'Pizza', 95, true),
  ('33333333-3333-3333-3333-333333333333', 'Chocolate Truffle Cake', 'Rich chocolate cake layered with truffle ganache.', 599, 20, '/assets/placeholder.jpg', 'Cake', 150, true),
  ('44444444-4444-4444-4444-444444444444', 'Red Velvet Cupcake', 'Soft and fluffy red velvet topped with cream cheese frosting.', 99, 100, '/assets/placeholder.jpg', 'Cupcake', 210, true),
  ('55555555-5555-5555-5555-555555555555', 'Garlic Breadsticks', 'Freshly baked breadsticks brushed with garlic butter.', 149, 80, '/assets/placeholder.jpg', 'Sides', 65, true)
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Custom Catalogues
INSERT INTO public.custom_catalogues (id, name, description, image_url, is_active)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Weekend Special Combos', 'Best deals for your weekend parties.', '/assets/placeholder.jpg', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Birthday Bashes', 'Everything you need for a perfect birthday celebration.', '/assets/placeholder.jpg', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Link Products to Catalogues
INSERT INTO public.catalogue_items (catalogue_id, product_id)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444')
ON CONFLICT DO NOTHING;

-- 4. Seed Orders (Over the last 7 days)
INSERT INTO public.orders (id, ticket_id, user_name, user_email, user_phone, total_amount, status, delivery_address, created_at)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'TKT-123456', 'John Doe', 'john@example.com', '9876543210', 448, 'delivered', '123 Main St, Kolkata', now() - interval '3 days'),
  ('10000000-0000-0000-0000-000000000002', 'TKT-789012', 'Jane Smith', 'jane@example.com', '8765432109', 599, 'confirmed', '456 Park Avenue, Kolkata', now() - interval '1 day'),
  ('10000000-0000-0000-0000-000000000003', 'TKT-345678', 'Bob Wilson', 'bob@example.com', '7654321098', 1197, 'pending', '789 Salt Lake, Kolkata', now() - interval '2 hours'),
  ('10000000-0000-0000-0000-000000000004', 'TKT-901234', 'Alice Brown', 'alice@example.com', '6543210987', 299, 'cancelled', '321 New Town, Kolkata', now() - interval '5 days'),
  ('10000000-0000-0000-0000-000000000005', 'TKT-555555', 'Charlie Davis', 'charlie@example.com', '5555555555', 798, 'delivered', '55 Sector V, Kolkata', now() - interval '6 days')
ON CONFLICT (id) DO NOTHING;

-- 5. Seed Order Items
INSERT INTO public.order_items (order_id, product_id, product_name, quantity, price_at_time)
VALUES
  -- Order 1: Margherita (299) + Garlic Bread (149) = 448
  ('10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Margherita Pizza', 1, 299),
  ('10000000-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', 'Garlic Breadsticks', 1, 149),
  
  -- Order 2: Chocolate Truffle Cake (599)
  ('10000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'Chocolate Truffle Cake', 1, 599),
  
  -- Order 3: 3x Pepperoni Pizza (3 * 399 = 1197)
  ('10000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'Pepperoni Pizza', 3, 399),
  
  -- Order 4: Margherita (299) Cancelled
  ('10000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'Margherita Pizza', 1, 299),

  -- Order 5: 2x Pepperoni Pizza (2 * 399 = 798)
  ('10000000-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'Pepperoni Pizza', 2, 399)
ON CONFLICT (id) DO NOTHING;
