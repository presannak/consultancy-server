const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://earthmover.netlify.app/");
    next();
});

app.get('/', (req, res, next) => {
    res.status(200).json({
        message: "hello from api"
    });
});

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
const pool = new Pool({
    user: 'presanna',
    host: 'my-db.c7k2a4260dch.ap-south-1.rds.amazonaws.com',
    database: 'initial_db',
    password: 'rajdeepak',
    port: 5432,
    ssl: true
});

app.post('/submit-form', async (req, res) => {
    try {
        const { from_name, user_email, subject, message } = req.body;

        const result = await pool.query(
            'INSERT INTO contact_messages (from_name, user_email, subject, message) VALUES ($1, $2, $3, $4)',
            [from_name, user_email, subject, message]
        );

        res.status(200).json({ message: 'Form data stored successfully' });
    } catch (error) {
        console.error('Error inserting form data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/submitTestimonial', async (req, res) => {
    try {
        const { name, location, text } = req.body;

        const result = await pool.query(
            'INSERT INTO testimonials (name, location, text) VALUES ($1, $2, $3)',
            [name, location, text]
        );

        res.status(200).json({ message: 'Testimonial data stored successfully' });
    } catch (error) {
        console.error('Error inserting testimonial data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/reviews', createProxyMiddleware({
    target: 'http://13.127.129.221:3001/re', // Target URL of your HTTP endpoint
    changeOrigin: true, // Change the origin of the host header to the target URL
    secure: false, // Do not verify SSL certificates
}));

// Add proxy middleware for '/submit-form' endpoint
app.use('/submit-form', createProxyMiddleware({
    target: 'http://13.127.129.221:3001', // Target URL of your HTTP endpoint
    changeOrigin: true, // Change the origin of the host header to the target URL
    secure: false, // Do not verify SSL certificates
}));

// Proxy middleware for '/submitTestimonial' endpoint
app.use('/submitTestimonial', createProxyMiddleware({
    target: 'http://13.127.129.221:3001', // Target URL of your HTTP endpoint
    changeOrigin: true, // Change the origin of the host header to the target URL
    secure: false, // Do not verify SSL certificates
}));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
