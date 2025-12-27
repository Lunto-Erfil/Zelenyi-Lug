const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST /api/orders
router.post('/', async (req, res) => {
    try {
        const { name, phone, email, message } = req.body;
        
        // Валидация
        if (!name || !phone || !email || !message) {
            return res.status(400).json({ 
                error: 'Все поля обязательны для заполнения' 
            });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: 'Некорректный формат email' 
            });
        }
        
        const queryText = `
            INSERT INTO orders (customer_name, customer_phone, customer_email, order_details, status)
            VALUES ($1, $2, $3, $4, 'новый')
            RETURNING id, customer_name, customer_phone, customer_email, order_details, status, created_at
        `;
        
        const result = await db.query(queryText, [name, phone, email, message]);
        
        console.log('✅ Новый заказ создан:', result.rows[0]);
        
        res.status(201).json({
            message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
            order: result.rows[0]
        });
    } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        res.status(500).json({ 
            error: 'Ошибка при отправке заявки', 
            message: error.message 
        });
    }
});

// GET /api/orders
router.get('/', async (req, res) => {
    try {ы
        const queryText = `
            SELECT 
                id,
                customer_name,
                customer_phone,
                customer_email,
                order_details,
                status,
                created_at,
                updated_at
            FROM orders
            ORDER BY created_at DESC
            LIMIT 100
        `;
        
        const result = await db.query(queryText);
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении заказов:', error);
        res.status(500).json({ 
            error: 'Ошибка при получении заказов', 
            message: error.message 
        });
    }
});

// GET /api/orders/:id - Получить заказ по ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const queryText = `
            SELECT 
                id,
                customer_name,
                customer_phone,
                customer_email,
                order_details,
                status,
                created_at,
                updated_at
            FROM orders
            WHERE id = $1
        `;
        
        const result = await db.query(queryText, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Заказ не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при получении заказа:', error);
        res.status(500).json({ 
            error: 'Ошибка при получении заказа', 
            message: error.message 
        });
    }
});

module.exports = router;