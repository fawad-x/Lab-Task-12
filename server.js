const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

// Static files and middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ DATABASE CONNECTION - user_complient
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '4630',  // Your password here
    database: 'user_complient',  // ✅ YOUR DATABASE NAME
    insecureAuth: true
});

db.connect((err) => {
    if (err) {
        console.log('⚠️ MySQL Connection Failed:', err.message);
        console.log('📌 Make sure:');
        console.log('   1. MySQL service is running');
        console.log('   2. Database "user_complient" exists');
        console.log('   3. Username/password is correct');
    } else {
        console.log('✅ Connected to Database: user_complient');
    }
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/track', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'track.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// API: Submit complaint
app.post('/submit-complaint', (req, res) => {
    const { name, phone, location, problem } = req.body;
    
    const sql = `INSERT INTO complaints (name, phone, location, problem) 
                 VALUES (?, ?, ?, ?)`;
    
    db.query(sql, [name, phone, location, problem], (err, result) => {
        if (err) {
            console.error('Database Error:', err);
            return res.json({ 
                success: false, 
                error: 'Database error. Check if table exists.' 
            });
        }
        res.json({ 
            success: true, 
            complaintId: result.insertId,
            message: 'Complaint submitted to user_complient database!' 
        });
    });
});

// API: Get complaint by ID
app.get('/get-complaint/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM complaints WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(result[0] || null);
    });
});

// API: Get all complaints
app.get('/get-all-complaints', (req, res) => {
    db.query('SELECT * FROM complaints ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// API: Update status with logging
app.post('/update-status', (req, res) => {
    const { id, status, admin_action = 'Status Updated' } = req.body;
    
    // Get old status first
    db.query('SELECT status FROM complaints WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (result.length === 0) {
            return res.json({ error: 'Complaint not found in user_complient' });
        }
        
        const old_status = result[0].status;
        
        // Update complaint
        db.query('UPDATE complaints SET status = ? WHERE id = ?', 
            [status, id], (err, updateResult) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Update failed' });
                }
                
                // Log to admin_logs
                const logSql = `INSERT INTO admin_logs 
                                (admin_action, complaint_id, old_status, new_status) 
                                VALUES (?, ?, ?, ?)`;
                
                db.query(logSql, [admin_action, id, old_status, status], (logErr) => {
                    if (logErr) {
                        console.error('Log error:', logErr);
                    }
                    
                    res.json({ 
                        success: true, 
                        message: `Status updated in user_complient database!` 
                    });
                });
            });
    });
});

// API: Get admin logs
app.get('/get-admin-logs', (req, res) => {
    db.query('SELECT * FROM admin_logs ORDER BY action_time DESC LIMIT 50', 
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        });
});

// API: Check database
app.get('/check-db', (req, res) => {
    db.query('SELECT COUNT(*) as total FROM complaints', (err, result) => {
        if (err) {
            return res.json({ 
                database: 'user_complient', 
                status: 'Error', 
                error: err.message 
            });
        }
        res.json({ 
            database: 'user_complient', 
            status: 'Connected', 
            totalComplaints: result[0].total 
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 Server: http://localhost:' + PORT);
    console.log('📌 Database: user_complient');
    console.log('✅ Home: http://localhost:' + PORT);
    console.log('✅ Track: http://localhost:' + PORT + '/track');
    console.log('✅ Admin: http://localhost:' + PORT + '/admin');
    console.log('✅ DB Check: http://localhost:' + PORT + '/check-db');
    console.log('='.repeat(50));
});