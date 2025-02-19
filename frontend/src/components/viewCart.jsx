import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';
import emptycart from '../assets/empty-cart.png';
import Checkout from './Checkout';
import { useCart } from '../context/CartProvider';  // Import useCart
import '../scss/viewCart.scss';

const ViewCart = () => {
  const { products, handleRemove, handleQuantityChange, calculateSubtotal, checkbox, setCheckbox } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (checkbox) {
      setShowCheckout(true);
    } else {
      alert("Please agree to the terms and conditions to proceed.");
    }
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };
  useEffect(()=>{
    window.scrollTo(0,0)
  },[])

  return (
    <>
      
      
        <div className="viewCart">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="product-info">
                      <img
                        src={item.image}
                        alt={item.title}
                        onClick={() => navigate(`/product/${item._id}`)}
                      />
                      <div className="productDetails">
                        <div onClick={() => navigate(`/product/${item._id}`)}>
                          <p className="productTitle">{String(item.title).slice(0, 40)}</p>
                          <p>Color: <span>{item.color}</span></p>
                          <p>Category: <span>{item.category}</span></p>
                        </div>
                        <div className="action-buttons">
                          <button className="edit-btn"><FiEdit /></button>
                          <button className="delete-btn" onClick={() => handleRemove(item._id)}>
                            <RiDeleteBinLine />
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className='price'>
                      <del>Rs.{(item.price * 5).toFixed(2)}</del>
                      <p>Rs.{item.price.toFixed(2)}</p>
                    </div>
                  </td>
                  <td>
                    <div className="quantityOption">
                      <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)}><FaMinus /></button>
                      <input type="text" readOnly value={item.quantity} />
                      <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}><FaPlus /></button>
                    </div>
                  </td>
                  <td>
                    <p className='finalPrice'>Rs.{(item.price * item.quantity).toFixed(2)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='help-order-section'>
            <div className="help-section">
              <h3>Add Order Note</h3>
              <textarea name="help" placeholder="How Can I Help You?"></textarea>
              <h3>Coupon</h3>
              <p>Coupon code will work on checkout page</p>
              <input type="text" placeholder="Coupon Code" />
            </div>
            <div className="finaliseOrder">
              <p className='subtotal'>SUBTOTAL: <span>RS. {calculateSubtotal()}</span> </p>
              <p>Tax included and shipping calculated at checkout</p>
              <label>
                <input type="checkbox" checked={checkbox} onChange={(e) => setCheckbox(e.target.checked)} />
                I agree with the <span className="terms-text">terms and conditions</span>.
              </label>
              <button onClick={handleCheckout}>Place Order</button>
            </div>
          </div>
          {showCheckout && <Checkout onClose={handleCloseCheckout} />}
        </div>
      
    </>
  );
};

export default ViewCart;
  