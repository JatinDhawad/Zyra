const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3000;

// Import user model
const User = require('./models/user');

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup
app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Database initialization
async function initializeDatabase() {
    const dbName = 'ZYRA1';

    // Create a connection to MySQL server (no need to connect to a DB just yet)
    const rootConnection = await mysql.createConnection({
        host: 'localhost',
        user: 'zyrauser',
        password: 'jatin2210'
    });

    try {
        // Ensure the database exists
        await rootConnection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        console.log(`✅ Database '${dbName}' is ready.`);
    } catch (err) {
        console.error("❌ Database creation error:", err);
        process.exit(1);
    } finally {
        await rootConnection.end();
    }

    // Connect to the specific DB
    const dbConnection = await mysql.createConnection({
        host: 'localhost',
        user: 'zyrauser',
        password: 'jatin2210',
        database: dbName
    });

    try {
        await dbConnection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(100) NOT NULL
            )
        `);
        console.log("✅ Users table is ready.");
    } catch (err) {
        console.error("❌ Table creation error:", err);
        process.exit(1);
    } finally {
        await dbConnection.end();
    }
}

// Initialize database on startup
initializeDatabase().catch(err => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
});

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/signin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signin.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"));
});

// Sign In route
app.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await User.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.status(200).json({ message: "Sign In Successful", user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Error during sign-in:", error);
        res.status(500).json({ message: "An error occurred during sign-in" });
    }
});

// Sign Up route
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const newUser = await User.create({ name, email, password });
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "An error occurred during sign up" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});