import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('farmer');
    const [formData, setFormData] = useState({
        phoneNumber: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const loginData = userType === 'farmer' 
                ? { phoneNumber: formData.phoneNumber, password: formData.password }
                : { email: formData.email, password: formData.password };

            console.log('Attempting login with:', loginData);

            const response = await axios.post(`http://localhost:5000/api/auth/${userType}/login`, loginData);
            
            console.log('Login response:', response.data);

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userType', userType);
                localStorage.setItem('userData', JSON.stringify(response.data.user));
                
                navigate(userType === 'farmer' ? '/farmer/dashboard' : '/consumer/dashboard');
            } else {
                setError(response.data.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(
                err.response?.data?.message || 
                err.response?.data?.msg || 
                err.message || 
                'An error occurred during login. Please try again.'
            );
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="user-type-toggle">
                    <button 
                        className={`toggle-btn ${userType === 'farmer' ? 'active' : 'active'}`}
                        onClick={() => setUserType('farmer')}
                    >
                        Farmer
                    </button>
                    <button 
                        className={`toggle-btn ${userType === 'consumer' ? 'active' : 'active'}`}
                        onClick={() => setUserType('consumer')}
                    >
                        Consumer
                    </button>
                </div>

                <h2>{userType === 'farmer' ? 'Farmer Login' : 'Consumer Login'}</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {userType === 'farmer' ? (
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
                    ) : (
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

                    <button type="submit" className="login-btn">
                        Login
                    </button>
                </form>

                <div className="signup-link">
                    Don't have an account?{' '}
                    <button 
                        className="signup-btn"
                        onClick={() => navigate(`/signup/${userType}`)}
                    >
                        Sign Up as {userType === 'farmer' ? 'Farmer' : 'Consumer'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;