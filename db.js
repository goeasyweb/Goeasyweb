// db.js
const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017'; // Replace with your Mongo URI if needed
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db('goeasyweb'); // You can change 'goeasyweb' to your desired DB name
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}

connectDB();

module.exports = () => db;
