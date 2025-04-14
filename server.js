const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to DB
const getDb = require('./db');
global.db = getDb();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/long-body', require('./routes/LongBody'));
app.use('/api/bill-submit', require('./routes/WoodBill'));
app.use('/api/shift-report', require('./routes/ShiftReport'));
app.use('/api/methanol', require('./routes/Methanol'));
app.use('/api/user', require('./routes/User'));

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.get('/long-body', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/long-body.html'));
});
app.get('/bill-register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/bill-register.html'));
});
app.get('/shift-report', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/shift-report.html'));
});
app.get('/methanol', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/methanol.html'));
});
app.get('/view', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/view.html'));
});
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
