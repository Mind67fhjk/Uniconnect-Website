require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt'); // import bcrypt for password hashing
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const saltRounds = 10; // For bcrypt: the cost factor for hashing

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
        release();
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

// Create a 'users' table if it doesn't exist
async function createUsersTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Users table ensured to exist.');
    } catch (err) {
        console.error('Error creating users table:', err);
    }
}
createUsersTable();

// Middleware:
app.use(cors());
app.use(express.json());

// Authentication middleware (placed before protected routes)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Expect header format: "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Authentication token required.'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err){
            return res.status(403).json({ error: 'Invalid or expired token.'});
        }
        req.user = user;
        next();
    });

};

// Existing API endpoint (can delete if you prefer)
app.get('/api/message', (req, res) => {
    res.json({ message: "Hello from Uniconnect Backend!" });
});

// API endpoint to get all students
app.get('/api/students', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching students:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint to add a new student (protected)
app.post('/api/students', authenticateToken, async (req, res) => {
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


// API endpoint to delete a student by ID (protected)
app.delete('/api/students/:id', authenticateToken, async (req, res) => {
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


// API endpoint to get a single student by ID
// If you prefer this to be protected, uncomment the protected version below and comment out the public one.
// app.get('/api/students/:id', authenticateToken, async (req, res) => {
app.get('/api/students/:id', async (req, res) => {
    const { id } = req.params;

    try{
         const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);

             if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found.' });
        }
        res.status(200).json(result.rows[0]);
    }catch(err){
        console.error('Error fetching a single student:', err);
        res.status(500).json({ error: 'Internal server error'});
    }
});


// API endpoint to update a student by ID (protected)
app.put('/api/students/:id', authenticateToken, async (req, res) => {
    const {id} = req.params;
    const {name, university, major} = req.body;

    if(!name || !university || !major){
        res.status(400).json({ error: 'Name, University, and Major are required to update a student information.'});
        return;
    }

    try{
        const result = await pool.query(`
            UPDATE students SET name = $1, university = $2, major = $3, created_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *
        `, [name, university, major, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found.' });
        }
        res.status(200).json(result.rows[0]);
    }catch(err){
        console.error('Error updating student:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})


// User Registration Endpoint
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        // Check if user already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'User with this email already exists.' });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert new user into the database
        const result = await pool.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
            [email, passwordHash]
        );

        // Respond with new user details (excluding password_hash)
        res.status(201).json({ message: 'User registered successfully!', user: result.rows[0] });

    } catch (err) {
        console.error('Error during user registration:', err);
        res.status(500).json({ error: 'Internal server error during registration.' });
    }
});




// NEW: User Login
app.post('/api/login', async (req, res)=>{
    const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ error: 'Email and password are required.'})
        }

        try{
            const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = userResult.rows[0];
            if(!user){
                return res.status(401).json({ error: "Invalid email or password." });  
            }

            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if(!isPasswordValid){
                return res.status(401).json({error: "Invalid Password"})
            }

            const token = jwt.sign({
                userId:user.id,
                email: user.email},
                process.env.JWT_SECRET,
                { expiresIn: '1h'}
            );

            res.status(200).json({
                message : "Login successful!", 
                token, 
                user:{ 
                    id: user.id,
                    email: user.email
                } 
                });

            
        } catch(err){
            console.error('Error during user login:', err);
            res.status(500).json({error: 'Internal server error during login.'});
        }
});


// Example of a protected route (only accessible to authenticated users)
// You can apply `authenticateToken` to any route you want to protect.
// For now, let's protect the GET /api/students endpoint

app.get('/api/protected-students', authenticateToken, async (req, res)=>{
    try{
        // req.user will contain the payload from the JWT ({ userId: ..., email: ... })
        console.log('Authenticated user trying to access students:', req.user);
        const result = await pool.query('SELECT * FROM students ORDER BY created_at DESC');

        res.json({
            message: `Hello ${req.user.email} , here are the students.`,
            students: result.rows

        });
    }catch (err) {
        console.error('Error fetching students for authenticated user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Uniconnect Backend listening at http://localhost:${port}`);
});