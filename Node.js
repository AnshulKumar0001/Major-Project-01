// server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3001;

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// --- MySQL Database Connection ---
// Create a connection to the database
// IMPORTANT: Replace with your actual database credentials
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // your database user
  password: 'password', // your database password
  database: 'user_auth_db', // your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// --- API Routes ---

/**
 * @route POST /register
 * @desc Register a new user
 * @access Public
 */
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(sql, [username, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ message: 'Error registering user. The username might already be taken.' });
    }
    res.status(201).json({ message: 'User registered successfully!' });
  });
});


/**
 * @route POST /login
 * @desc Authenticate a user and log them in
 * @access Public
 */
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password.' });
  }

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }

    // Check if user was found
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const user = results[0];

    // Compare the provided password with the hashed password from the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      // Passwords match - login successful
      res.status(200).json({ message: 'Login successful!', username: user.username });
    } else {
      // Passwords do not match
      res.status(401).json({ message: 'Invalid username or password.' });
    }
  });
});

// --- Start the server ---
app.listen(port, () => {
  console.log(Server is running on http://localhost:${port});
});
