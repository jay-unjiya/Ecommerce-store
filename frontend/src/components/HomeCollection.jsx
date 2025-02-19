import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/reducers';
import '../scss/HomeCollection.scss';
import wishlist from '../assets/wishlist.png';
import quickview from '../assets/quickview.png';
import compare from '../assets/compare.png';
import { openCart } from './Navbar';
import { useCart } from '../context/CartProvider';

const HomeCollection = () => {
  const { handleCartUpdate, isAdmin, loadingCartProducts } = useCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(state => state.products.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const limitedData = data ? data.slice(0, 8) : [];

  return (
    <div className="home-collection">
      <div className="content">
        <span>Explore Your Style</span>
      </div>
      <div className="home-collection-items">
        {!isAdmin && limitedData.map((item, index) => (
          <div key={index} className="home-collection-card">
            <div className="sale-tag">Sale</div>
            <div className="icon-container">
              <a href="#" className="icon-link"><img src={wishlist} alt="Wishlist" /></a>
              <a href="#" className="icon-link"><img src={quickview} alt="Quick View" /></a>
              <a href="#" className="icon-link"><img src={compare} alt="Compare" /></a>
            </div>
            <div onClick={() => navigate(`/product/${item._id}`)}>
              <img src={item.image} alt={item.title} className="product-image" />
            </div>
            <div className="product-info">
              <p className="product-title">{String(item.title).slice(0, 40)}...</p>
              <p>
                <span className="price">Rs. {item.price.toFixed(2)}</span>
                <del className="delPrice"> Rs. {(item.price * 5).toFixed(2)}</del>
              </p>
              <button 
                className="home-collection-btn" 
                onClick={() => handleCartUpdate({ item, quantity: 1, openCart })}
                disabled={loadingCartProducts[item._id]}
              >
                {loadingCartProducts[item._id] ? (
                  <span className="button-loader"></span>
                ) : (
                  "Add To Cart"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCollection;