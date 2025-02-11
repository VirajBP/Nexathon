import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import { 
    FaShoppingBag, 
    FaHistory, 
    FaBox, 
    FaArrowRight, 
    FaLeaf, 
    FaStore,
    FaCalendarAlt
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { consumerData } from '../../mockData/consumerData';
import './ConsumerDashboard.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const ConsumerDashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(consumerData.dashboard);
    const [timeFilter, setTimeFilter] = useState('6M');

    // Sample data for different time periods
    const spendingData = {
        '6M': {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [3000, 4500, 3800, 5200, 4800, 6000]
        },
        '3M': {
            labels: ['Apr', 'May', 'Jun'],
            data: [5200, 4800, 6000]
        },
        '1M': {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [1500, 1800, 1600, 2000]
        }
    };

    const getChartData = (period) => ({
        labels: spendingData[period].labels,
        datasets: [{
            label: 'Monthly Spending',
            data: spendingData[period].data,
            fill: true,
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderColor: '#6366f1',
            tension: 0.4
        }]
    });

    const [chartData, setChartData] = useState(getChartData('6M'));

    const handleTimeFilterChange = (period) => {
        setTimeFilter(period);
        setChartData(getChartData(period));
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div className="consumer-dashboard">
            <Sidebar userType="consumer" />
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <div className="welcome-section">
                        <h1>Welcome back, {consumerData.profile.name}!</h1>
                        <p>Here's what's happening with your orders</p>
                    </div>
                    <button className="new-order-btn" onClick={() => navigate('/consumer/market')}>
                        <FaStore /> Browse Market
                    </button>
                </div>

                <div className="stats-grid">
                    <div className="stat-card primary">
                        <div className="stat-icon">
                            <FaShoppingBag />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Active Orders</span>
                            <h3>{dashboardData.orderStats.pendingOrders}</h3>
                            <span className="stat-change positive">+2 from last week</span>
                        </div>
                    </div>

                    <div className="stat-card success">
                        <div className="stat-icon">
                            <FaLeaf />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Different Farmers</span>
                            <h3>12</h3>
                            <span className="stat-change">Ordered from this month</span>
                        </div>
                    </div>

                    <div className="stat-card warning">
                        <div className="stat-icon">
                            <FaCalendarAlt />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Scheduled Deliveries</span>
                            <h3>5</h3>
                            <span className="stat-change">Next 7 days</span>
                        </div>
                    </div>
                </div>

                <div className="dashboard-main">
                    <div className="spending-trends">
                        <div className="section-header">
                            <h2>Spending Trends</h2>
                            <div className="time-filters">
                                {['6M', '3M', '1M'].map((period) => (
                                    <button
                                        key={period}
                                        className={timeFilter === period ? 'active' : ''}
                                        onClick={() => handleTimeFilterChange(period)}
                                    >
                                        {period}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="chart-container">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="recent-activity">
                        <div className="section-header">
                            <h2>Recent Activity</h2>
                            <button className="view-all" onClick={() => navigate('/consumer/orders')}>
                                View All <FaArrowRight />
                            </button>
                        </div>
                        <div className="activity-list">
                            {dashboardData.recentOrders.map(order => (
                                <div key={order._id} className="activity-item">
                                    <div className="activity-icon">
                                        <FaBox />
                                    </div>
                                    <div className="activity-details">
                                        <div className="activity-header">
                                            <h4>Order from {order.farmerName}</h4>
                                            <span className={`status ${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="activity-items">
                                            {order.items.map(item => item.productName).join(', ')}
                                        </p>
                                        <div className="activity-meta">
                                            <span className="amount">₹{order.totalAmount}</span>
                                            <span className="date">
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsumerDashboard; 