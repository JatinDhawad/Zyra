const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

// Database configuration
const dbConfig = {
    host: "localhost",
    user: "zyrauser",
    password: "jatin2210",
    database: "ZYRA1",
};

// Create a user model
const User = {
    // Create a new user
    async create(userData) {
        if (!userData.name || !userData.email || !userData.password) {
            throw new Error("Missing required fields: name, email, or password");
        }

        const connection = await mysql.createConnection(dbConfig);
        try {
            // Hash the password
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            console.log("Creating user with data:", userData);

            const [result] = await connection.execute(
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                [userData.name, userData.email, hashedPassword]
            );

            console.log("User created successfully with ID:", result.insertId);

            return {
                id: result.insertId,
                name: userData.name,
                email: userData.email,
            };
        } catch (err) {
            console.error("Error creating user:", err);
            throw err;
        } finally {
            await connection.end();
        }
    },

    // Find a user by email
    async findByEmail(email) {
        if (!email) {
            throw new Error("Email is required to find a user");
        }

        const connection = await mysql.createConnection(dbConfig);
        try {
            const [rows] = await connection.execute(
                "SELECT * FROM users WHERE email = ?",
                [email]
            );

            if (!rows[0]) {
                console.log(`No user found with email: ${email}`);
                return null;
            }

            return rows[0]; // Return the first user found
        } catch (err) {
            console.error("Error finding user by email:", err);
            throw err;
        } finally {
            await connection.end();
        }
    },

    // Verify a user's password
    async verifyPassword(inputPassword, storedPassword) {
        if (!storedPassword) {
            throw new Error("Stored password is missing or invalid");
        }

        try {
            return await bcrypt.compare(inputPassword, storedPassword);
        } catch (err) {
            console.error("Error verifying password:", err);
            throw err;
        }
    },
};

module.exports = User;