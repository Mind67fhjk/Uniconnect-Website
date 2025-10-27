require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Import Pool from 'pg'
const app = express();
const port = 3000;

// Database connection pool setup
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release(); // Release the client back to the pool
        if (err) {
            return console.error('Error executing query', err.stack);
        }
        console.log('Database connected successfully!', result.rows[0]);
    });
});

// Create a simple 'students' table if it doesn't exist
async function createStudentsTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                university VARCHAR(100),
                major VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Students table ensured to exist.');
    } catch (err) {
        console.error('Error creating students table:', err);
    }
}
createStudentsTable(); // Call this function when the server starts

// Middleware:
app.use(cors());
app.use(express.json());

// Existing API endpoint (can delete if you prefer)
app.get('/api/message', (req, res) => {
    res.json({ message: "Hello from Uniconnect Backend!" });
});

// NEW: API endpoint to get all students
app.get('/api/students', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// NEW: API endpoint to add a new student
app.post('/api/students', async (req, res) => {
    const { name, university, major } = req.body;
    if (!name || !university || !major) {
        return res.status(400).json({ error: 'Name, university, and major are required.' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO students (name, university, major) VALUES ($1, $2, $3) RETURNING *',
            [name, university, major]
        );
        res.status(201).json(result.rows[0]); // Return the newly created student
    } catch (err) {
        console.error('Error adding student:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Uniconnect Backend listening at http://localhost:${port}`);
});


// NEW: API endpoint to delete a student by ID
app.delete('/api/students/:id', async (req, res) => {
    const { id } = req.params; // Extract the ID from the URL parameters
    try {
        const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            // If no rows were returned, it means no student with that ID was found
            return res.status(404).json({ error: 'Student not found.' });
        }
        res.status(200).json({ message: 'Student deleted successfully!', deletedStudent: result.rows[0] });
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});