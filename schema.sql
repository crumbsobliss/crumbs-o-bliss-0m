-- Create a table for public profiles linked to auth.users
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique,
  role text check (role in ('admin', 'manager', 'user')) default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for products
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null,
  stock integer default 0,
  image_url text, -- Store the full ImageKit URL
  image_file_path text, -- Store the file path in ImageKit for easier deletion
  color text, -- Store the product background color
  category text,
  view_count integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for custom catalogues
create table custom_catalogues (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for linking products to catalogues (Many-to-Many)
create table catalogue_items (
  catalogue_id uuid references custom_catalogues(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  primary key (catalogue_id, product_id)
);

-- Create a table for orders
create table orders (
  id uuid default gen_random_uuid() primary key,
  ticket_id text unique not null, -- Usage: Random string generated on client
  user_name text,
  user_email text, -- Optional
  user_phone text, -- Required for tracking
  total_amount numeric not null,
  status text check (status in ('pending', 'confirmed', 'cancelled', 'delivered')) default 'pending',
  admin_notes text,
  delivery_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for order items
create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete set null, -- Keep verification history even if product deleted
  product_name text not null, -- Snapshot of product name at time of order
  quantity integer not null,
  price_at_time numeric not null, -- Snapshot of price at time of order
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table products enable row level security;
alter table custom_catalogues enable row level security;
alter table catalogue_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Policies

-- Profiles:
-- Users can view their own profile.
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
-- Admins and Managers can view all profiles.
create policy "Admins/Managers view all profiles" on profiles for select using (
  auth.uid() in (select id from profiles where role in ('admin', 'manager'))
);

-- Products:
-- Everyone can view products (public read).
create policy "Public products are viewable by everyone" on products for select using (true);
-- Only Admins can insert/update/delete products.
create policy "Admins can manage products" on products for all using (
  auth.uid() in (select id from profiles where role = 'admin')
);

-- Custom Catalogues:
-- Everyone can view active catalogues.
create policy "Public catalogues are viewable by everyone" on custom_catalogues for select using (is_active = true);
-- Admins can manage catalogues.
create policy "Admins can manage catalogues" on custom_catalogues for all using (
  auth.uid() in (select id from profiles where role = 'admin')
);
-- Catalogue Items: Public read, Admin write
create policy "Public catalogue items viewable" on catalogue_items for select using (true);
create policy "Admins manage catalogue items" on catalogue_items for all using (
  auth.uid() in (select id from profiles where role = 'admin')
);


-- Orders:
-- Public can create orders (INSERT).
create policy "Public can create orders" on orders for insert with check (true);
-- Admins/Managers view all orders
create policy "Admins/Managers view all orders" on orders for select using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'manager'))
);
-- Admins can update orders.
create policy "Admins can update orders" on orders for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Order Items:
-- Public can insert order items.
create policy "Public can create order items" on order_items for insert with check (true);
-- Admins/Managers can view.
create policy "Admins/Managers view order items" on order_items for select using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'manager'))
);


-- Function to handle new user signup (Trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Function to get order details securely
create or replace function public.get_order_details(p_ticket_id text, p_phone text)
returns json as $$
declare
  v_order record;
  v_items json;
begin
  -- Find the order matching both ticket_id and user_phone
  select id, ticket_id, user_name, status, total_amount, created_at, delivery_address, admin_notes
  into v_order
  from public.orders
  where ticket_id = p_ticket_id and user_phone = p_phone;

  if not found then
    return null;
  end if;

  -- Get all items for this order
  select json_agg(json_build_object(
    'id', id,
    'product_name', product_name,
    'quantity', quantity,
    'price_at_time', price_at_time
  ))
  into v_items
  from public.order_items
  where order_id = v_order.id;

  -- Return combined result
  return json_build_object(
    'order', json_build_object(
      'id', v_order.id,
      'ticket_id', v_order.ticket_id,
      'user_name', v_order.user_name,
      'status', v_order.status,
      'total_amount', v_order.total_amount,
      'created_at', v_order.created_at,
      'delivery_address', v_order.delivery_address,
      'admin_notes', v_order.admin_notes
    ),
    'items', coalesce(v_items, '[]'::json)
  );
end;
$$ language plpgsql security definer;

-- Function to safely increment product view count
create or replace function public.increment_product_view(p_id uuid)
returns void as $$
begin
  update public.products
  set view_count = coalesce(view_count, 0) + 1
  where id = p_id;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed an Admin User (Optional - You'll likely do this manually or update the role)
-- update profiles set role = 'admin' where email = 'your-email@example.com';
