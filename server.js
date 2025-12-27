const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/api/products', require('./backend/routes/products'));
app.use('/api/orders', require('./backend/routes/orders'));
app.use('/api/auth', require('./backend/routes/auth'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'farm.html'));
});

app.get('/auth.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'auth.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend available at http://localhost:${PORT}`);
});