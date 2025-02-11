const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Farmer = require('../Model/Farmer');
const Consumer = require('../Model/Consumer');

exports.register = async (req, res) => {
    try {
        const userType = req.path.includes('farmer') ? 'farmer' : 'consumer';

        if (userType === 'farmer') {
            const { name, phoneNumber, password, location } = req.body;

            // Check if farmer already exists
            let farmer = await Farmer.findOne({ phoneNumber });
            if (farmer) {
                return res.status(400).json({ msg: 'Farmer already exists with this phone number' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create farmer
            farmer = new Farmer({
                name,
                phoneNumber,
                password: hashedPassword,
                location
            });

            await farmer.save();

            // Create JWT token
            const payload = {
                user: {
                    id: farmer.id,
                    type: 'farmer'
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '24h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } else {
            // Consumer registration (unchanged)
            const { name, email, password, location, phoneNumber, type } = req.body;
            
            let consumer = await Consumer.findOne({ email });
            if (consumer) {
                return res.status(400).json({ msg: 'Consumer already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            consumer = new Consumer({
                name,
                email,
                password: hashedPassword,
                location,
                phoneNumber,
                type
            });

            await consumer.save();

            const payload = {
                user: {
                    id: consumer.id,
                    type: 'consumer'
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '24h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    try {
        const { userType } = req.body;

        if (userType === 'farmer') {
            const { phoneNumber, password } = req.body;
            
            // Check if farmer exists
            const farmer = await Farmer.findOne({ phoneNumber });
            if (!farmer) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            // Verify password
            const isMatch = await bcrypt.compare(password, farmer.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            // Create JWT token
            const payload = {
                user: {
                    id: farmer.id,
                    type: 'farmer'
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '24h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } else {
            // Consumer login (unchanged)
            const { email, password } = req.body;
            
            const consumer = await Consumer.findOne({ email });
            if (!consumer) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, consumer.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            const payload = {
                user: {
                    id: consumer.id,
                    type: 'consumer'
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '24h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}; 