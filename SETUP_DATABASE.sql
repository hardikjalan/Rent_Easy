CREATE TABLE IF NOT EXISTS sellers (
    seller_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    business_name VARCHAR(150),
    business_address TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS events (
    event_id SERIAL PRIMARY KEY,
    event_name VARCHAR(150) NOT NULL,
    location VARCHAR(150),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    description TEXT,
    capacity INTEGER,
    price_per_day NUMERIC(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS accessories (
    accessory_id SERIAL PRIMARY KEY,
    accessory_name VARCHAR(150) NOT NULL,
    description TEXT,
    price_per_day NUMERIC(10, 2) NOT NULL,
    quantity_available INTEGER DEFAULT 1,
    is_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS payments (
    payment_id SERIAL PRIMARY KEY,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100) UNIQUE,
    payment_date VARCHAR(50),
    created_at VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    event_id BIGINT,
    payment_id BIGINT,
    accessory_ids TEXT,
    accessory_quantities TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    booking_status VARCHAR(50) DEFAULT 'PENDING',
    created_at VARCHAR(50)
);

INSERT INTO events (event_name, location, city, state, postal_code, description, capacity, price_per_day, is_available) VALUES
('Corporate Conference Hall', '123 Business Plaza', 'Mumbai', 'Maharashtra', '400001', 'Spacious conference hall with AV equipment', 100, 5000.00, true),
('Wedding Venue - Grand Palace', '456 Heritage Road', 'Delhi', 'Delhi', '110001', 'Beautiful outdoor wedding venue', 300, 15000.00, true),
('Seminar Room - Tech Hub', '789 Innovation Street', 'Bangalore', 'Karnataka', '560001', 'Modern tech-enabled seminar room', 50, 3000.00, true),
('Party Hall - Celebration Center', '321 Fun Lane', 'Pune', 'Maharashtra', '411001', 'Indoor party hall with lighting', 150, 8000.00, true),
('Exhibition Space - Trade Center', '555 Commerce Avenue', 'Hyderabad', 'Telangana', '500001', 'Large exhibition space with booths', 200, 10000.00, true);

INSERT INTO accessories (accessory_name, description, price_per_day, quantity_available, is_available) VALUES
('HD Projector (4K)', '4K Ultra HD projector with 5000 lumens', 500.00, 10, true),
('Professional Microphone Set', 'Wireless microphone system with 4 mics', 300.00, 8, true),
('LED Video Wall Panel', 'Indoor LED display panel', 1500.00, 4, true),
('Sound System Package', 'Complete PA system with speakers', 800.00, 6, true),
('Photo Booth Setup', 'Fun photo booth with props', 1000.00, 3, true),
('Stage Lighting Kit', 'Professional stage lights with controller', 400.00, 5, true),
('Folding Tables Set', '60 inch round tables (set of 10)', 200.00, 20, true),
('Chairs Rental (100 pcs)', 'Comfortable event chairs', 300.00, 100, true);

