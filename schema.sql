-- Create the ENUM type for order status
CREATE TYPE public.order_status AS ENUM (
    'New',
    'Preparing',
    'Ready for Pickup',
    'Completed',
    'Cancelled'
);

-- Create the menu_items table
CREATE TABLE public.menu_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    price numeric NOT NULL,
    category text NOT NULL,
    image_url text NOT NULL,
    is_available boolean DEFAULT true NOT NULL,
    PRIMARY KEY (id)
);
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Create the orders table
CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_name text NOT NULL,
    total numeric NOT NULL,
    status public.order_status DEFAULT 'New'::public.order_status NOT NULL,
    order_time timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;


-- Create the order_items table
CREATE TABLE public.order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id uuid NOT NULL,
    menu_item_id uuid NOT NULL,
    quantity integer NOT NULL,
    price numeric NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id)
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;


-- Create Policies for public access (for demonstration purposes)
-- In a production environment, you should create more restrictive policies.

CREATE POLICY "Allow public read access to menu_items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Allow public read access to orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public read access to order_items" ON public.order_items FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to menu_items" ON public.menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access to orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access to order_items" ON public.order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to menu_items" ON public.menu_items FOR UPDATE USING (true);
CREATE POLICY "Allow public update access to orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access to menu_items" ON public.menu_items FOR DELETE USING (true);

-- Insert some sample data

-- Sample Menu Items
INSERT INTO public.menu_items (name, description, price, category, image_url, is_available) VALUES
('Campus Burger', 'A classic beef burger with all the fixings.', 8.99, 'Main', 'https://picsum.photos/seed/burger/600/400', true),
('Cheesy Pizza', '12-inch pizza with mozzarella and tomato sauce.', 12.50, 'Main', 'https://picsum.photos/seed/pizza/600/400', true),
('Garden Salad', 'Fresh greens, tomatoes, cucumbers, and a light vinaigrette.', 6.50, 'Side', 'https://picsum.photos/seed/salad/600/400', true),
('Chicken Tenders', 'Crispy chicken tenders with your choice of sauce.', 7.99, 'Main', 'https://picsum.photos/seed/tenders/600/400', false),
('Fountain Drink', 'Refreshing soda from our fountain.', 1.99, 'Beverage', 'https://picsum.photos/seed/drink/600/400', true),
('Spicy Chicken Sandwich', 'A fiery chicken sandwich for the brave.', 9.50, 'Main', 'https://picsum.photos/seed/spicy_chicken/600/400', true);

-- Get UUIDs for menu items to use in orders
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DO $$
DECLARE
    burger_id uuid;
    pizza_id uuid;
    salad_id uuid;
    drink_id uuid;
    order1_id uuid;
    order2_id uuid;
    order3_id uuid;
BEGIN
    SELECT id INTO burger_id FROM public.menu_items WHERE name = 'Campus Burger';
    SELECT id INTO pizza_id FROM public.menu_items WHERE name = 'Cheesy Pizza';
    SELECT id INTO salad_id FROM public.menu_items WHERE name = 'Garden Salad';
    SELECT id INTO drink_id FROM public.menu_items WHERE name = 'Fountain Drink';

    -- Sample Orders
    INSERT INTO public.orders (customer_name, total, status, order_time) VALUES
    ('Alice Smith', 23.47, 'New', NOW() - INTERVAL '10 minutes') RETURNING id INTO order1_id;

    INSERT INTO public.orders (customer_name, total, status, order_time) VALUES
    ('Bob Johnson', 19.99, 'Preparing', NOW() - INTERVAL '5 minutes') RETURNING id INTO order2_id;

    INSERT INTO public.orders (customer_name, total, status, order_time) VALUES
    ('Charlie Brown', 6.50, 'Ready for Pickup', NOW() - INTERVAL '2 minutes') RETURNING id INTO order3_id;

    -- Sample Order Items
    IF order1_id IS NOT NULL THEN
        INSERT INTO public.order_items (order_id, menu_item_id, quantity, price) VALUES
        (order1_id, burger_id, 1, 8.99),
        (order1_id, pizza_id, 1, 12.50),
        (order1_id, drink_id, 1, 1.99);
    END IF;

    IF order2_id IS NOT NULL THEN
        INSERT INTO public.order_items (order_id, menu_item_id, quantity, price) VALUES
        (order2_id, pizza_id, 1, 12.50),
        (order2_id, salad_id, 1, 6.50),
        (order2_id, drink_id, 1, 1.99);
    END IF;

    IF order3_id IS NOT NULL THEN
        INSERT INTO public.order_items (order_id, menu_item_id, quantity, price) VALUES
        (order3_id, salad_id, 1, 6.50);
    END IF;
END $$;
