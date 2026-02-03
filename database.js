const mysql = require('mysql');

// Create connection
const db = mysql.createConnection({
    host: "localhost",
    user: "node user",
    password: "node123", // Agar password hai toh daalo
    database: "complaint_system"
});
~
// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL Database');
});

module.exports = db;