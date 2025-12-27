# Экоферма "Зелёный Луг" - Веб-сайт с подключением к PostgreSQL

Это веб-приложение для экофермы с подключением к базе данных PostgreSQL.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

3. Настройте подключение к базе данных в файле `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=farm
DB_USER=postgres
DB_PASSWORD=ваш_пароль
PORT=3000
```

4. Убедитесь, что PostgreSQL установлен и база данных "farm" создана.

## Структура базы данных

Необходимые таблицы в базе данных "farm":

### Таблица `products`:
```sql
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price_per_unit DECIMAL(10, 2),
    quantity DECIMAL(10, 2),
    unit VARCHAR(50),
    description TEXT,
    source_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Таблица `sources`:
```sql
CREATE TABLE IF NOT EXISTS sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Таблица `orders`:
```sql
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
```

### Таблица `users` (для авторизации):
```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Включить расширение для хеширования паролей
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

## Запуск

### Режим разработки (с автоперезагрузкой):
```bash
npm run dev
```

### Режим продакшена:
```bash
npm start
```

Сервер будет доступен по адресу: http://localhost:3000

## API Endpoints

- `GET /api/products` - Получить все продукты
- `GET /api/products/:id` - Получить продукт по ID
- `GET /api/products/category/:category` - Получить продукты по категории
- `POST /api/orders` - Создать новый заказ
- `GET /api/orders` - Получить все заказы (требует авторизации)
- `POST /api/auth/login` - Вход пользователя
- `GET /api/auth/verify` - Проверка токена

## Структура проекта

```
farm/
├── frontend/
│   └── farm.html          # Главная HTML страница
├── backend/
│   ├── server.js          # Главный файл сервера
│   ├── config/
│   │   └── database.js    # Конфигурация базы данных
│   └── routes/
│       ├── products.js    # Маршрут для продуктов
│       ├── orders.js      # Маршрут для заказов
│       └── auth.js        # Маршрут для авторизации
├── package.json
├── .env.example
└── README.md
```