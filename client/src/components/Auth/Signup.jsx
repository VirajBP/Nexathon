import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Signup.css';

// Define API URL from environment variable
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Signup = () => {
    const navigate = useNavigate();
    const { userType } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: userType === 'consumer' ? '' : undefined,
        password: '',
        confirmPassword: '',
        location: '',
        type: userType === 'consumer' ? 'restaurant' : undefined
    });
    const [error, setError] = useState('');

    const consumerTypes = ['supermarket', 'restaurant', 'healthcare', 'food processing', 'Events', 'ngo'];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Remove undefined fields and confirmPassword before sending
            const signupData = Object.fromEntries(
                Object.entries(formData).filter(([key, value]) => 
                    value !== undefined && key !== 'confirmPassword'
                )
            );

            console.log('Attempting signup with:', signupData);

            const response = await axios.post(
                `${API_URL}/auth/${userType}/register`, 
                signupData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Signup response:', response.data);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userType', userType);
                navigate(`/${userType}/dashboard`);
            } else {
                setError('Invalid response from server');
            }
        } catch (err) {
            console.error('Signup error:', err.response || err);
            setError(err.response?.data?.message || 'An error occurred during signup');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>Sign Up as {userType === 'farmer' ? 'Farmer' : 'Consumer'}</h2>
                
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>

                    {userType === 'consumer' && (
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter your location"
                            required
                        />
                    </div>

                    {userType === 'consumer' && (
                        <div className="form-group">
                            <label>Consumer Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select type</option>
                                {consumerTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <button type="submit" className="signup-button">
                        Sign Up
                    </button>
                </form>

                <div className="login-link">
                    Already have an account?{' '}
                    <button 
                        className="login-redirect-btn"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;
