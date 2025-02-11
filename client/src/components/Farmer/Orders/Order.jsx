// import { useState } from "react";
// import Sidebar from '../../Sidebar/Sidebar';
// import './Order.css';

// export default function FarmerOrders() {
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const [orders, setOrders] = useState([
//     { 
//       id: 1, 
//       name: "Wheat", 
//       status: "Pending",
//       quantity: "100 kg",
//       price: "₹2000",
//       customerName: "Rajesh Kumar",
//       orderDate: "2024-03-20",
//       deliveryDate: "2024-03-25"
//     },
//     { 
//       id: 2, 
//       name: "Rice", 
//       status: "Pending",
//       quantity: "50 kg",
//       price: "₹3000",
//       customerName: "Suresh Verma",
//       orderDate: "2024-03-21",
//       deliveryDate: "2024-03-26"
//     },
//     { 
//       id: 3, 
//       name: "Corn", 
//       status: "Pending",
//       quantity: "75 kg",
//       price: "₹1500",
//       customerName: "Amit Sharma",
//       orderDate: "2024-03-22",
//       deliveryDate: "2024-03-27"
//     },
//   ]);

//   const handleStatusChange = (id, status) => {
//     setOrders((prevOrders) =>
//       prevOrders.map((order) =>
//         order.id === id ? { ...order, status } : order
//       )
//     );
//   };

//   return (
//     <div className="dashboard-container">
//       <Sidebar 
//         userType="farmer" 
//         onToggle={(collapsed) => setIsSidebarCollapsed(collapsed)}
//       />
//       <div className={`dashboard-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
//         <h1 className="orders-heading">Pending Orders</h1>
//         <div className="table-container">
//           <table className="orders-table">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>Product</th>
//                 <th>Quantity</th>
//                 <th>Price</th>
//                 <th>Customer</th>
//                 <th>Order Date</th>
//                 <th>Delivery Date</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.filter(order => order.status === "Pending").map((order) => (
//                 <tr key={order.id}>
//                   <td>#{order.id}</td>
//                   <td>{order.name}</td>
//                   <td>{order.quantity}</td>
//                   <td>{order.price}</td>
//                   <td>{order.customerName}</td>
//                   <td>{order.orderDate}</td>
//                   <td>{order.deliveryDate}</td>
//                   <td>
//                     <span className="status-badge status-pending">
//                       {order.status}
//                     </span>
//                   </td>
//                   <td>
//                     <div className="action-buttons">
//                       <button 
//                         className="action-button accept-button"
//                         onClick={() => handleStatusChange(order.id, "Accepted")}
//                       >
//                         Accept
//                       </button>
//                       <button 
//                         className="action-button reject-button"
//                         onClick={() => handleStatusChange(order.id, "Rejected")}
//                       >
//                         Reject
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <h1 className="orders-heading">All Orders</h1>
//         <div className="table-container">
//           <table className="orders-table">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>Product</th>
//                 <th>Quantity</th>
//                 <th>Price</th>
//                 <th>Customer</th>
//                 <th>Order Date</th>
//                 <th>Delivery Date</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order.id}>
//                   <td>#{order.id}</td>
//                   <td>{order.name}</td>
//                   <td>{order.quantity}</td>
//                   <td>{order.price}</td>
//                   <td>{order.customerName}</td>
//                   <td>{order.orderDate}</td>
//                   <td>{order.deliveryDate}</td>
//                   <td>
//                     <span className={`status-badge status-${order.status.toLowerCase()}`}>
//                       {order.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import Sidebar from '../../Sidebar/Sidebar';
import './Order.css';

export default function FarmerOrders() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [orders, setOrders] = useState([
    { 
      id: 1, 
      name: "Wheat", 
      status: "Pending",
      quantity: "100 kg",
      price: "₹2000",
      customerName: "Rajesh Kumar",
      orderDate: "2024-03-20",
      deliveryDate: "2024-03-25"
    },
    { 
      id: 2, 
      name: "Rice", 
      status: "Pending",
      quantity: "50 kg",
      price: "₹3000",
      customerName: "Suresh Verma",
      orderDate: "2024-03-21",
      deliveryDate: "2024-03-26"
    },
    { 
      id: 3, 
      name: "Corn", 
      status: "Pending",
      quantity: "75 kg",
      price: "₹1500",
      customerName: "Amit Sharma",
      orderDate: "2024-03-22",
      deliveryDate: "2024-03-27"
    },
  ]);

  const [visibleOrders, setVisibleOrders] = useState([]);

  useEffect(() => {
    // Animate orders appearing with a delay
    setTimeout(() => {
      setVisibleOrders(orders);
    }, 300);
  }, [orders]);

  const handleStatusChange = (id, status) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        userType="farmer" 
        onToggle={(collapsed) => setIsSidebarCollapsed(collapsed)}
      />
      <div className={`dashboard-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <h1 className="orders-heading">Pending Orders</h1>
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Customer</th>
                <th>Order Date</th>
                <th>Delivery Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.filter(order => order.status === "Pending").map((order, index) => (
                <tr key={order.id} className="order-row animate" style={{ animationDelay: `${index * 0.1}s` }}>
                  <td>#{order.id}</td>
                  <td>{order.name}</td>
                  <td>{order.quantity}</td>
                  <td>{order.price}</td>
                  <td>{order.customerName}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.deliveryDate}</td>
                  <td>
                    <span className="status-badge status-pending">
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-button accept-button"
                        onClick={() => handleStatusChange(order.id, "Accepted")}
                      >
                        Accept
                      </button>
                      <button 
                        className="action-button reject-button"
                        onClick={() => handleStatusChange(order.id, "Rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h1 className="orders-heading">All Orders</h1>
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Customer</th>
                <th>Order Date</th>
                <th>Delivery Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order, index) => (
                <tr key={order.id} className="order-row animate" style={{ animationDelay: `${index * 0.1}s` }}>
                  <td>#{order.id}</td>
                  <td>{order.name}</td>
                  <td>{order.quantity}</td>
                  <td>{order.price}</td>
                  <td>{order.customerName}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.deliveryDate}</td>
                  <td>
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
