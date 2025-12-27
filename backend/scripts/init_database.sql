CREATE TABLE IF NOT EXISTS sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price_per_unit DECIMAL(10, 2),
    quantity DECIMAL(10, 2),
    unit VARCHAR(50) DEFAULT 'шт',
    description TEXT,
    source_id INTEGER REFERENCES sources(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    order_details TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'новый',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_source_id ON products(source_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO sources (name, description) VALUES
    ('Грядка №1', 'Основная грядка с овощами'),
    ('Сад', 'Фруктовый сад'),
    ('Ферма', 'Животноводческая ферма')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, category, price_per_unit, quantity, unit, description, source_id) VALUES
    ('Помидоры', 'Овощи', 150.00, 100.00, 'кг', 'Свежие помидоры с грядки', 1),
    ('Огурцы', 'Овощи', 120.00, 80.00, 'кг', 'Хрустящие огурцы', 1),
    ('Яблоки', 'Фрукты', 200.00, 150.00, 'кг', 'Сладкие яблоки из сада', 2),
    ('Молоко', 'Молочные продукты', 120.00, 50.00, 'л', 'Свежее молоко', 3),
    ('Говядина', 'Мясо', 450.00, 30.00, 'кг', 'Натуральная говядина', 3)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE products IS 'Таблица продуктов фермы';
COMMENT ON TABLE orders IS 'Таблица заказов клиентов';
COMMENT ON TABLE sources IS 'Таблица источников продукции';
COMMENT ON TABLE users IS 'Таблица пользователей системы';
