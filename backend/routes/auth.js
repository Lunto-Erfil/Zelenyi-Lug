const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email и пароль обязательны' 
            });
        }
        
        const queryText = `
            SELECT id, name, email, role
            FROM users
            WHERE email = $1 AND password = crypt($2, password)
        `;
        
        const result = await db.query(queryText, [email, password]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ 
                error: 'Неверный email или пароль' 
            });
        }
        
        const user = result.rows[0];
        
        const token = `mock_token_${user.id}_${Date.now()}`;
        
        res.json({
            message: 'Успешный вход',
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Ошибка при входе:', error);
        res.status(500).json({ 
            error: 'Ошибка при входе', 
            message: error.message 
        });
    }
});

// GET /api/auth/verify
router.get('/verify', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'Токен не предоставлен' 
            });
        }
        
        const token = authHeader.substring(7);
        
        if (token.startsWith('mock_token_')) {
            return res.json({
                valid: true,
                message: 'Токен действителен'
            });
        }
        
        res.status(401).json({ 
            error: 'Недействительный токен' 
        });
    } catch (error) {
        console.error('Ошибка при проверке токена:', error);
        res.status(500).json({ 
            error: 'Ошибка при проверке токена', 
            message: error.message 
        });
    }
});

module.exports = router;