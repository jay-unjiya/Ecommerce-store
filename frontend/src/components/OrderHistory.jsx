import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../scss/AdminPanel.scss';
import { RiDownloadCloud2Line } from "react-icons/ri";
import { useCart } from '../context/CartProvider';
import TableLoader from '../components/TableLoader';

const OrderHistory = ({ userId, user }) => {
  const [orders, setOrders] = useState([]);
  const { BASE_URL } = useCart();
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true); // Set loading to true when fetching orders
        const response = await axios.get(`${BASE_URL}/orders/user/${userId}`);
        console.log(response.data);
        setOrders(response.data.orders || []); // Ensure orders is an array
        
        // Set loading to false after a 1 second delay
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]); // Fallback to empty array on error
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchOrders();
  }, [userId, BASE_URL]);

  const truncateText = (text, length) => {
    if (text.length > length) {
      return text.substring(0, length) + '...';
    }
    return text;
  };

  const generateInvoice = async (order) => {
    const doc = new jsPDF();
    doc.setFontSize(28);
    doc.text('Invoice', 20, 10);
    doc.setFontSize(14);
    doc.text(`Order ID: ${order._id}`, 20, 20);
    doc.text(`Date: ${new Date(order.orderDate).toLocaleDateString()}`, 20, 30);
    doc.text(`User Name: ${user.firstName} ${user.lastName}`, 20, 40);
    doc.text(`User Email: ${user.email}`, 20, 50);

    const columns = ['Product Name', 'Category', 'Price', 'Quantity'];
    const rows = order.products.map(product => [
      { content: truncateText(product.title, 12), styles: { halign: 'left' } },
      { content: product.category, styles: { halign: 'left' } },
      { content: product.price.toFixed(2), styles: { halign: 'left' } },
      { content: product.quantity, styles: { halign: 'left' } }
    ]);

    const totalPrice = order.products.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 60,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240] // Light gray rows for better readability
      },
    });
    doc.text(`Total: $${totalPrice}`, 14, doc.autoTable.previous.finalY + 10);
    doc.save(`invoice_${order._id}.pdf`);
  };

  // Show table loader while loading
  if (loading) {
    return <TableLoader />;
  }

  return (
    <div className="order-history">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <div className='no-orders-message'>No order found</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
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
                      </>
                    )}
                    <td>
                      <img src={product.image} alt={product.title} className="product-image" />
                      {truncateText(product.title, 12)}
                    </td>
                    <td>{product.category}</td>
                    <td>{product.price.toFixed(2)}</td>
                    <td>{product.quantity}</td>
                    {idx === 0 && (
                      <td className='download-icon-td' rowSpan={order.products.length}>
                        <button onClick={() => generateInvoice(order)} > <RiDownloadCloud2Line className='download-icon'/></button>
                      </td>
                    )}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;