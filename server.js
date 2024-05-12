// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
// const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors())

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","http://localhost:5173")
    next()
})
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'earthmovers',
  password: 'presanna07',
  port: 5432,
});

app.get('/test',(req,res,next)=>{
  res.status(200),json({
    message:"hello from api"
  })
})

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

    res.status(200).json({ message: 'Form data stored successfully' });
  } catch (error) {
    console.error('Error inserting form data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/reviews', async (req, res) => {
  try {

    const result = await pool.query(
      'select * from testimonials'
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

module.exports=app;
