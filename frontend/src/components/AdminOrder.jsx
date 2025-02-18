import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../scss/AdminPanel.scss';
import { useCart } from '../context/CartProvider';
import TableLoader from '../components/TableLoader';

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { BASE_URL } = useCart();

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/orders`);
        setOrders(response.data);
        // Simulate minimum loading time of 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      {isLoading ? (
        <TableLoader rowsCount={6} />
      ) : (

        <>
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
                      {idx === 0 && (
                        <td rowSpan={order.products.length}>{order.totalPrice}</td>
                      )}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table></>
      )}
    </div>
  );
};

export default AdminOrderPage;