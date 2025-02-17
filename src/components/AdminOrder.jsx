// AdminOrderPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../scss/AdminPanel.scss';

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Orders</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <React.Fragment key={index}>
              {order.products.map((product, idx) => (
                <tr key={idx}>
                  {idx === 0 && (
                    <>
                      <td rowSpan={order.products.length}>{order._id}</td>
                      <td rowSpan={order.products.length}>{order.userId}</td>
                    </>
                  )}
                  <td>
                    <img src={product.image} alt={product.title} className="product-image" />
                    {product.title}
                  </td>
                  <td>{product.category}</td>
                  <td>{product.price.toFixed(2)}</td>
                  <td>{product.quantity}</td>
                  <td>{order.totalPrice}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderPage;
