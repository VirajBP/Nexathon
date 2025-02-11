import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaUser, FaSignOutAlt, FaBars, FaEdit, 
         FaSave, FaTimes, FaDownload, FaSearch, FaSort, FaShoppingCart } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import './FarmerProducts.css';
import Sidebar from "../../Sidebar/Sidebar"

ChartJS.register(ArcElement, Tooltip, Legend);

const ProductPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  
  const [products, setProducts] = useState([
    { id: 1, productName: 'Tomatoes', productVariety: 'Cherry', quantity: 100, price: 40, estimatedDate: '2024-04-01' },
    { id: 2, productName: 'Potatoes', productVariety: 'Russet', quantity: 200, price: 25, estimatedDate: '2024-04-15' },
    { id: 3, productName: 'Carrots', productVariety: 'Baby', quantity: 150, price: 30, estimatedDate: '2024-04-10' },
  ]);

  const [newProduct, setNewProduct] = useState({
    productName: '',
    productType: 'crop',
    productVariety: '',
    quantity: '',
    price: '',
    estimatedDate: '',
    moisture: '',
    quality: '',
    storageCondition: '',
    transportAvailable: false,
    minOrderQuantity: '',
    harvestDate: '',
    chemicalsFree: false,
    organicCertified: false,
  });

  const [editFormData, setEditFormData] = useState({
    productName: '',
    productVariety: '',
    quantity: '',
    price: '',
    estimatedDate: ''
  });

  const chartData = {
    labels: products.map(product => `${product.productName} (${product.productVariety})`),
    datasets: [{
      data: products.map(product => product.quantity),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ],
      borderWidth: 1,
    }],
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    setProducts([...products, { ...newProduct, id: Date.now() }]);
    setNewProduct({
      productName: '',
      productType: 'crop',
      productVariety: '',
      quantity: '',
      price: '',
      estimatedDate: '',
      moisture: '',
      quality: '',
      storageCondition: '',
      transportAvailable: false,
      minOrderQuantity: '',
      harvestDate: '',
      chemicalsFree: false,
      organicCertified: false,
    });
    setShowAddProduct(false);
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditFormData(product);
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setProducts(products.map(product => 
      product.id === editingId ? editFormData : product
    ));
    setEditingId(null);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getFilteredAndSortedProducts = () => {
    let filteredProducts = products.filter(product => {
      const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.productVariety.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = (!priceRange.min || product.price >= Number(priceRange.min)) &&
                          (!priceRange.max || product.price <= Number(priceRange.max));
      return matchesSearch && matchesPrice;
    });

    if (sortConfig.key) {
      filteredProducts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredProducts;
  };

  const downloadCSV = () => {
    const headers = ['Product Name', 'Variety', 'Quantity', 'Price', 'Available From'];
    const csvData = getFilteredAndSortedProducts().map(product => [
      product.productName,
      product.productVariety,
      product.quantity,
      product.price,
      product.estimatedDate
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderAdditionalFields = () => {
    if (newProduct.productType === 'residue') {
      return (
        <>
          <input
            type="number"
            placeholder="Moisture Content (%)"
            value={newProduct.moisture}
            onChange={(e) => setNewProduct({...newProduct, moisture: e.target.value})}
            required
          />
          <select
            value={newProduct.quality}
            onChange={(e) => setNewProduct({...newProduct, quality: e.target.value})}
            required
          >
            <option value="">Select Quality Grade</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
          </select>
          <select
            value={newProduct.storageCondition}
            onChange={(e) => setNewProduct({...newProduct, storageCondition: e.target.value})}
            required
          >
            <option value="">Select Storage Condition</option>
            <option value="indoor">Indoor Storage</option>
            <option value="covered">Covered Outdoor</option>
            <option value="open">Open Storage</option>
          </select>
          <div className="checkbox-field">
            <input
              type="checkbox"
              id="transport"
              checked={newProduct.transportAvailable}
              onChange={(e) => setNewProduct({...newProduct, transportAvailable: e.target.checked})}
            />
            <label htmlFor="transport">Transport Available</label>
          </div>
        </>
      );
    } else {
      return (
        <>
          <input
            type="date"
            placeholder="Harvest Date"
            value={newProduct.harvestDate}
            onChange={(e) => setNewProduct({...newProduct, harvestDate: e.target.value})}
            required
          />
          <div className="checkbox-field">
            <input
              type="checkbox"
              id="chemicalsFree"
              checked={newProduct.chemicalsFree}
              onChange={(e) => setNewProduct({...newProduct, chemicalsFree: e.target.checked})}
            />
            <label htmlFor="chemicalsFree">Chemical Free</label>
          </div>
          <div className="checkbox-field">
            <input
              type="checkbox"
              id="organic"
              checked={newProduct.organicCertified}
              onChange={(e) => setNewProduct({...newProduct, organicCertified: e.target.checked})}
            />
            <label htmlFor="organic">Organic Certified</label>
          </div>
        </>
      );
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
                userType="farmer" 
                onToggle={(collapsed) => setIsSidebarCollapsed(collapsed)}
            />
      {/* <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>FarmConnect</h2>
          <button className="sidebar-toggle" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
            <FaBars />
          </button>
        </div>
        <nav className="nav-links">
          <Link to="/farmer/dashboard" className="nav-link">
            <FaHome />
            <span>Dashboard</span>
          </Link>
          <Link to="/farmer/products" className="nav-link active">
            <FaBox />
            <span>Products</span>
          </Link>
          <Link to="/farmer/orders" className="nav-link">
            <FaShoppingCart />
            <span>Orders</span>
          </Link>
          <Link to="/farmer/profile" className="nav-link">
            <FaUser />
            <span>Profile</span>
          </Link>
          <Link to="/login" className="nav-link logout">
            <FaSignOutAlt />
            <span>Logout</span>
          </Link>
        </nav>
      </div> */}

      {/* Main Content */}
      <div className={`main-content ${isSidebarCollapsed ? 'expanded' : ''}`}>
        <div className="page-header">
          <h1>Products</h1>
          <div className="header-actions">
            <button className="download-btn" onClick={downloadCSV}>
              <FaDownload /> Export CSV
            </button>
          </div>
        </div>

        <div className="content-grid">
          {/* Add Product Section */}
          <div className="section-card add-product-section">
            <h2>Add New Product</h2>
            <button 
              className="add-product-button"
              onClick={() => setShowAddProduct(!showAddProduct)}
            >
              {showAddProduct ? 'Cancel' : 'Add New Product'}
            </button>

            {showAddProduct && (
              <form className="add-product-form" onSubmit={handleAddProduct}>
                <div className="form-grid">
                  <select
                    value={newProduct.productType}
                    onChange={(e) => setNewProduct({...newProduct, productType: e.target.value})}
                    required
                    className="product-type-select"
                  >
                    <option value="">Select Type</option>
                    <option value="crop">Agricultural Crop</option>
                    <option value="residue">Agricultural Residue</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.productName}
                    onChange={(e) => setNewProduct({...newProduct, productName: e.target.value})}
                    required
                  />
                  
                  <input
                    type="text"
                    placeholder="Variety/Type"
                    value={newProduct.productVariety}
                    onChange={(e) => setNewProduct({...newProduct, productVariety: e.target.value})}
                    required
                  />

                  <input
                    type="number"
                    placeholder="Quantity (kg)"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                    required
                  />

                  <input
                    type="number"
                    placeholder="Minimum Order Quantity (kg)"
                    value={newProduct.minOrderQuantity}
                    onChange={(e) => setNewProduct({...newProduct, minOrderQuantity: e.target.value})}
                    required
                  />

                  <input
                    type="number"
                    placeholder="Price per kg (₹)"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    required
                  />

                  <input
                    type="date"
                    placeholder="Available From"
                    value={newProduct.estimatedDate}
                    onChange={(e) => setNewProduct({...newProduct, estimatedDate: e.target.value})}
                    required
                  />

                  {renderAdditionalFields()}
                </div>
                <button type="submit" className="submit-button">Add Product</button>
              </form>
            )}
          </div>

          {/* Chart Section */}
          <div className="section-card chart-section">
            <h2>Product Distribution</h2>
            <div className="chart-container">
              <Pie data={chartData} options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right'
                  }
                }
              }} />
            </div>
          </div>

          {/* Products List Section */}
          <div className="section-card products-list-section">
            <h2>Manage Products</h2>
            {/* Search and Filter Section */}
            <div className="search-filter-bar">
              <div className="search-section">
                <div className="search-box">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="price-filter">
                <span className="price-filter-label">Price Range:</span>
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="products-table">
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('productName')}>
                      Product Name <FaSort />
                    </th>
                    <th onClick={() => handleSort('productVariety')}>
                      Variety <FaSort />
                    </th>
                    <th onClick={() => handleSort('quantity')}>
                      Quantity (kg) <FaSort />
                    </th>
                    <th onClick={() => handleSort('price')}>
                      Price (₹/kg) <FaSort />
                    </th>
                    <th onClick={() => handleSort('estimatedDate')}>
                      Available From <FaSort />
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredAndSortedProducts().map((product, index) => (
                    <tr key={product.id} className={index % 2 === 0 ? 'even' : 'odd'}>
                      {editingId === product.id ? (
                        <>
                          <td>
                            <input
                              type="text"
                              name="productName"
                              value={editFormData.productName}
                              onChange={handleEditFormChange}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="productVariety"
                              value={editFormData.productVariety}
                              onChange={handleEditFormChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="quantity"
                              value={editFormData.quantity}
                              onChange={handleEditFormChange}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              name="price"
                              value={editFormData.price}
                              onChange={handleEditFormChange}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              name="estimatedDate"
                              value={editFormData.estimatedDate}
                              onChange={handleEditFormChange}
                            />
                          </td>
                          <td>
                            <button className="save-button" onClick={handleEditSubmit}>
                              <FaSave />
                            </button>
                            <button className="cancel-button" onClick={() => setEditingId(null)}>
                              <FaTimes />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{product.productName}</td>
                          <td>{product.productVariety}</td>
                          <td>{product.quantity}</td>
                          <td>₹{product.price}</td>
                          <td>{new Date(product.estimatedDate).toLocaleDateString()}</td>
                          <td>
                            <button className="edit-button" onClick={() => handleEditClick(product)}>
                              <FaEdit />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
