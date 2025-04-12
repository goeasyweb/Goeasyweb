const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Static files serve karna from "public"
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Root route => index.html serve karega
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/goeasyweb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Connection Error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
