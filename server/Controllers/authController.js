const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Farmer = require('../Model/Farmer');
const Consumer = require('../Model/Consumer');

// Helper function to generate token
const generateToken = (user, type) => {
    return jwt.sign(
        { user: { id: user.id, type } },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

exports.register = async (req, res) => {
    try {
        const userType = req.path.includes('farmer') ? 'farmer' : 'consumer';

        if (userType === 'farmer') {
            const { name, phoneNumber, password, location } = req.body;

            // Validate required fields
            if (!name || !phoneNumber || !password || !location) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields'
                });
            }

            // Check if farmer exists
            const existingFarmer = await Farmer.findOne({ phoneNumber });
            if (existingFarmer) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number already registered'
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new farmer
            const farmer = new Farmer({
                name,
                phoneNumber,
                password: hashedPassword,
                location
            });

            await farmer.save();

            // Generate token
            const token = generateToken(farmer, 'farmer');

            // Send response without sensitive info
            res.status(201).json({
                success: true,
                token,
                user: {
                    id: farmer._id,
                    name: farmer.name,
                    phoneNumber: farmer.phoneNumber,
                    location: farmer.location,
                    type: 'farmer'
                }
            });

        } else {
            const { name, email, password, location, phoneNumber, type } = req.body;

            // Validate required fields
            if (!name || !email || !password || !location || !phoneNumber || !type) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields'
                });
            }

            // Check if consumer exists
            const existingConsumer = await Consumer.findOne({ email });
            if (existingConsumer) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new consumer
            const consumer = new Consumer({
                name,
                email,
                password: hashedPassword,
                location,
                phoneNumber,
                type
            });

            await consumer.save();

            // Generate token
            const token = generateToken(consumer, 'consumer');

            // Send response without sensitive info
            res.status(201).json({
                success: true,
                token,
                user: {
                    id: consumer._id,
                    name: consumer.name,
                    email: consumer.email,
                    location: consumer.location,
                    phoneNumber: consumer.phoneNumber,
                    type: consumer.type
                }
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.login = async (req, res) => {
    try {
        const userType = req.path.includes('farmer') ? 'farmer' : 'consumer';

        if (userType === 'farmer') {
            const { phoneNumber, password } = req.body;

            // Validate required fields
            if (!phoneNumber || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide phone number and password'
                });
            }

            // Find farmer
            const farmer = await Farmer.findOne({ phoneNumber });
            if (!farmer) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Verify password
            const isMatch = await bcrypt.compare(password, farmer.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Generate token
            const token = generateToken(farmer, 'farmer');

            // Send response
            res.json({
                success: true,
                token,
                user: {
                    id: farmer._id,
                    name: farmer.name,
                    phoneNumber: farmer.phoneNumber,
                    location: farmer.location,
                    type: 'farmer'
                }
            });

        } else {
            const { email, password } = req.body;

            // Validate required fields
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide email and password'
                });
            }

            // Find consumer
            const consumer = await Consumer.findOne({ email });
            if (!consumer) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Verify password
            const isMatch = await bcrypt.compare(password, consumer.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Generate token
            const token = generateToken(consumer, 'consumer');

            // Send response
            res.json({
                success: true,
                token,
                user: {
                    id: consumer._id,
                    name: consumer.name,
                    email: consumer.email,
                    location: consumer.location,
                    phoneNumber: consumer.phoneNumber,
                    type: 'consumer'
                }
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = exports;
