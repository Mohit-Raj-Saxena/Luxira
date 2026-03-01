const mongoose = require('mongoose');
const config = require('config');

const dbgr = require('debug')("development:mongoose");


mongoose
.connect(config.get("MONGODB_URI"))
.then(function(){
     dbgr("connected");
     console.log("✓ MongoDB connected successfully");
})
.catch(function(err){
     dbgr(err);
     console.error("✗ MongoDB connection failed:", err.message);
})

module.exports = mongoose.connection;