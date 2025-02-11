const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const connectDB = require("./Config/Database");
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmer', require('./routes/farmerRoutes'));
app.use('/api/consumer', require('./routes/consumerRoutes'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});