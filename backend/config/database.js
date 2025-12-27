const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'farm',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 5432,

    max: 20, 
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
    console.log('📊 Новое подключение к базе данных установлено');
});

pool.on('error', (err) => {
    console.error('❌ Неожиданная ошибка на неактивном клиенте базы данных', err);
    process.exit(-1);
});

const connect = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        console.log('🕐 Время сервера БД:', result.rows[0].now);
        client.release();
        return true;
    } catch (err) {
        throw err;
    }
};

const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('🔍 Выполнен запрос', { text, duration, rows: res.rowCount });
        return res;
    } catch (err) {
        console.error('❌ Ошибка выполнения запроса:', err);
        throw err;
    }
};

const getClient = async () => {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;
    
    const timeout = setTimeout(() => {
        console.error('⚠️ Клиент удерживается более 10 секунд!');
    }, 10000);
    
    client.release = () => {
        clearTimeout(timeout);
        return release.apply(client);
    };
    
    return client;
};

const disconnect = async () => {
    try {
        await pool.end();
        console.log('✅ Пул подключений к базе данных закрыт');
    } catch (err) {
        console.error('❌ Ошибка при закрытии пула подключений:', err);
    }
};

module.exports = {
    pool,
    query,
    getClient,
    connect,
    disconnect
};
