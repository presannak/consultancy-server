const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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
            'INSERT INTO contact_messages VALUES ($1, $2, $3, $4)',  
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
        console.log(name,location,text)
        const result = await pool.query(
            'INSERT INTO testimonials  VALUES ($1, $2, $3)',
            [name, location, text]
        );

        res.status(200).json(
            { 
                message: 'Testimonial data stored successfully' ,
                name,
                location,
                text
            });
    } catch (error) {
        console.error('Error inserting testimonial data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/reviews', async (req, res) => {
  try {

    const result = await pool.query(
      'select * from testimonials;'
    );
    // console.log(result);
    const {rows:data} = result;
    res.status(200).
    json({
        message: 'Form data stored successfully',
        data
     });
  } catch (error) {
    console.error('Error inserting form data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
