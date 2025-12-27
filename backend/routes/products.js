const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/products
router.get('/', async (req, res) => {
    try {
        const queryText = `
            SELECT 
                p.id,
                p.name,
                p.category,
                p.price_per_unit,
                p.quantity,
                p.unit,
                p.description,
                s.name as source_name,
                p.created_at,
                p.updated_at
            FROM products p
            LEFT JOIN sources s ON p.source_id = s.id
            ORDER BY p.created_at DESC
        `;
        
        const result = await db.query(queryText);
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении продуктов:', error);
        res.status(500).json({ 
            error: 'Ошибка при получении продуктов', 
            message: error.message 
        });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const queryText = `
            SELECT 
                p.id,
                p.name,
                p.category,
                p.price_per_unit,
                p.quantity,
                p.unit,
                p.description,
                s.name as source_name,
                p.created_at,
                p.updated_at
            FROM products p
            LEFT JOIN sources s ON p.source_id = s.id
            WHERE p.id = $1
        `;
        
        const result = await db.query(queryText, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Продукт не найден' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при получении продукта:', error);
        res.status(500).json({ 
            error: 'Ошибка при получении продукта', 
            message: error.message 
        });
    }
});

// GET /api/products/category/:category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const queryText = `
            SELECT 
                p.id,
                p.name,
                p.category,
                p.price_per_unit,
                p.quantity,
                p.unit,
                p.description,
                s.name as source_name,
                p.created_at,
                p.updated_at
            FROM products p
            LEFT JOIN sources s ON p.source_id = s.id
            WHERE p.category = $1
            ORDER BY p.created_at DESC
        `;
        
        const result = await db.query(queryText, [category]);
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении продуктов по категории:', error);
        res.status(500).json({ 
            error: 'Ошибка при получении продуктов', 
            message: error.message 
        });
    }
});

module.exports = router;