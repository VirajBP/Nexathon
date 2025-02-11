const express = require("express");
require("dotenv").config();
const app = express();
const connectDB = require("./Config/Database");
const cors = require('cors');
const mongoose=require("mongoose")
// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./Routes/authRoutes'));
app.use('/api/farmer', require('./Routes/farmerRoutes'));
app.use('/api/consumer', require('./Routes/consumerRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

const PORT = process.env.PORT || 5000;

// Error handling for MongoDB connection
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error during MongoDB connection closure:', err);
        process.exit(1);
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));