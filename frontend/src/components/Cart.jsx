import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiDeleteBinLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { FaMinus, FaPlus } from 'react-icons/fa';
import { GiCrossedBones } from "react-icons/gi";
import emptycart from '../assets/empty-cart.png';
import { closeNav } from './Navbar';
import { useCart } from '../context/CartProvider';
import '../scss/Cart.scss';

const Cart = () => {
  const { products, checkbox, setCheckbox, handleRemove, handleQuantityChange, calculateSubtotal, handleSubmitCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="cartContent">
      <div className="cartHeader">
        <h1>Shopping Cart</h1>
        <button className="closeCart" onClick={closeNav}><GiCrossedBones /></button>
      </div>
      <hr />
      {products.length === 0 ? (
        <div className="EmptyCart">
          <img className="empty" src={emptycart} alt="Empty Cart" />
          <h1>Your Cart is empty</h1>
          <button onClick={() => { closeNav(); navigate('/collection'); }}>
            CONTINUE SHOPPING
          </button>
        </div>
      ) : (
        <div className="cartDetails">
          {products.map((item, index) => (
            <div className='card' key={index}>
              <div className="content">
                <div className="image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="details">
                  <h4>{String(item.title).slice(0, 50)}</h4>
                  <del className="delPrice">Rs. {(item.price * 5)?.toFixed(2)}</del>
                  <p className="price">Rs. {item.price?.toFixed(2)}</p>
                  <div className="quantityOpt">
                    <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)}><FaMinus /></button>
                    <input type="text" readOnly value={item.quantity} />
                    <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}><FaPlus /></button>
                  </div>
                  <div className="action-buttons">
                    <button className="edit-btn"><FiEdit /></button>
                    <button className="delete-btn" onClick={() => handleRemove(item._id)}><RiDeleteBinLine /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="summary">
            <p>Subtotal: <span>Rs.{calculateSubtotal()}</span></p>
            <label>
              <input type="checkbox" onChange={(e) => setCheckbox(e.target.checked)} />
              I agree with the <span className="terms-text">terms and conditions</span>.
            </label>
            <button className="place-order-btn" onClick={()=>{handleSubmitCart(closeNav)}}>View Cart</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
