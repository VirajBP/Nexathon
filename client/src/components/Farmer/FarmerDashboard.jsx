import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import { FaShoppingBag, FaCalendarCheck, FaHistory, FaArrowRight } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import './FarmerDashboard.css';
import { farmerData } from '../../mockData/farmerData';

ChartJS.register(ArcElement, Tooltip, Legend);

const FarmerDashboard = () => {
    const navigate = useNavigate();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [dashboardData, setDashboardData] = useState(farmerData.dashboard);

    // Calculate total quantity for percentages
    const totalQuantity = dashboardData.inventory.reduce((sum, item) => sum + item.quantity, 0);

    // Updated chart data with percentages
    const chartData = {
        labels: dashboardData.inventory.map(item => item.productName),
        datasets: [{
            data: dashboardData.inventory.map(item => item.quantity),
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40'
            ]
        }]
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 20,
                    generateLabels: (chart) => {
                        const datasets = chart.data.datasets;
                        return chart.data.labels.map((label, i) => ({
                            text: `${label} (${Math.round((datasets[0].data[i] / totalQuantity) * 100)}%)`,
                            fillStyle: datasets[0].backgroundColor[i],
                            index: i
                        }));
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        const percentage = Math.round((value / totalQuantity) * 100);
                        return `${context.label}: ${value}kg (${percentage}%)`;
                    }
                }
            },
            datalabels: {
                color: '#fff',
                font: {
                    weight: 'bold',
                    size: 12
                },
                formatter: (value) => {
                    const percentage = Math.round((value / totalQuantity) * 100);
                    return percentage > 5 ? `${percentage}%` : ''; // Only show if > 5%
                }
            }
        },
        layout: {
            padding: 20
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar 
                userType="farmer" 
                onToggle={(collapsed) => setIsSidebarCollapsed(collapsed)}
            />
            <div className={`dashboard-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <h1>Dashboard</h1>
                
                <div className="dashboard-grid">
                    {/* Today's Orders */}
                    <div className="dashboard-card today-orders">
                        <div className="card-icon">
                            <FaShoppingBag />
                        </div>
                        <div className="card-content">
                            <h3>Today's Orders</h3>
                            <p className="card-number">{dashboardData.todayOrders.length}</p>
                            <div className="order-list">
                                {dashboardData.todayOrders.map(order => (
                                    <div key={order._id} className="order-item">
                                        <span>{order.productName}</span>
                                        <span>{order.quantity} kg</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Orders */}
                    <div className="dashboard-card upcoming-orders">
                        <div className="card-icon">
                            <FaCalendarCheck />
                        </div>
                        <div className="card-content">
                            <h3>Upcoming Orders</h3>
                            <p className="card-number">{dashboardData.upcomingOrders.length}</p>
                            <div className="order-list">
                                {dashboardData.upcomingOrders.map(order => (
                                    <div key={order._id} className="order-item">
                                        <span>{order.productName}</span>
                                        <span>{order.deliveryDate}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Total Orders */}
                    <div className="dashboard-card total-orders">
                        <div className="card-icon">
                            <FaHistory />
                        </div>
                        <div className="card-content">
                            <h3>Total Orders</h3>
                            <p className="card-number">{dashboardData.totalOrders}</p>
                            <p className="card-subtitle">Completed Orders</p>
                        </div>
                    </div>
                </div>

                {/* Lower Section */}
                <div className="dashboard-lower-section">
                    {/* Recent Orders Section */}
                    <div className="recent-orders-section">
                        <div className="section-header">
                            <h2>Recent Orders</h2>
                            <button 
                                className="view-all-btn"
                                onClick={() => navigate('/farmer/orders')}
                            >
                                View All Orders <FaArrowRight />
                            </button>
                        </div>
                        <div className="recent-orders-list">
                            {dashboardData.recentOrders.map(order => (
                                <div key={order._id} className="recent-order-item">
                                    <div className="order-info">
                                        <h4>{order.productName}</h4>
                                        <p>Quantity: {order.quantity} kg</p>
                                    </div>
                                    <div className="order-status">
                                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                        <p className="order-date">{new Date(order.orderDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Inventory Chart Section */}
                    <div className="inventory-chart-section">
                        <h2>Current Inventory</h2>
                        <div className="chart-container">
                            <Pie data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerDashboard; 