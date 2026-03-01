const mongoose = require('mongoose');
const config = require('config');

const dbgr = require('debug')("development:mongoose");

const mongoUri = config.get("MONGODB_URI");
console.log("📌 Attempting to connect to MongoDB...");
console.log("🔗 Connection String:", mongoUri.substring(0, 50) + "...");

mongoose
.connect(mongoUri)
.then(function(){
     dbgr("connected");
     console.log("✓ MongoDB connected successfully");
})
.catch(function(err){
     dbgr(err);
     console.error("✗ MongoDB connection failed:", err.message);
})

module.exports = mongoose.connection;