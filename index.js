const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const app = express();
app.use(express.json());


const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root', 
    password: 'root', 
    database: 'irctc_db',
});

module.exports = db;


const JWT_SECRET = crypto.randomBytes(64).toString('hex');

const ADMIN_API_KEY = "uuidv4"; 
const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};


const apiKeyAuthenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== ADMIN_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};


const authRoutes = require('./routes/auth');
const trainRoutes = require('./routes/train');
const bookingRoutes = require('./routes/booking');


app.use('/auth', authRoutes);
app.use('/train', trainRoutes);
app.use('/booking', bookingRoutes);


app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

const pool = mysql.createPool({
    
        host: '127.0.0.1',      
        user: 'root',  
        password: 'root', 
        database: 'irctc_db',     
    });


pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to database:", err);
        process.exit(1); 
    }
    console.log("Connected to database!");
    connection.release(); 
});

