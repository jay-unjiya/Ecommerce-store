import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { GrFormPrevious, GrNext } from "react-icons/gr";
import axios from 'axios';
import '../scss/ProductPage.scss';
import shopify from '../assets/shopify.png';
import Checkout from './Checkout';
import { openCart } from './Navbar';
import { useCart } from '../context/CartProvider';

const ProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const thumbnailRefs = useRef([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const { handleAddToCart, BASE_URL, loadingCartProducts } = useCart();

  const productImages = product?.image ? Array(10).fill(product.image) : [];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [id]);

  const decrement = () => {
    if (quantity !== 1) {
      setQuantity(quantity - 1);
    }
  };

  const increment = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCartClick = async () => {
    await handleAddToCart(id, quantity, openCart);
  };

  const handleBuyNow = () => {
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < productImages.length - 1) {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }
  };

  useEffect(() => {
    if (thumbnailRefs.current[currentImageIndex]) {
      thumbnailRefs.current[currentImageIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentImageIndex]);

  return (
    <>
      {loading ? (
        <div className="product-loader"></div>
      ) : (
        <>
          <div className="productPage">
            <div className="productImages">
              <button
                className="prevButton"
                onClick={(e) => {
                  e.preventDefault();
                  handlePrevImage();
                }}
              >
                <GrFormPrevious />
              </button>
              <img
                className="mainImage"
                src={productImages[currentImageIndex]}
                alt={product.title}
              />
              <button
                className="nextButton"
                onClick={(e) => {
                  e.preventDefault();
                  handleNextImage();
                }}
              >
                <GrNext />
              </button>
              <div className="thumbnailImages">
                {productImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} thumbnail ${index + 1}`}
                    ref={(el) => (thumbnailRefs.current[index] = el)}
                    className={index === currentImageIndex ? "active" : "inactive"}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
            <div className="productDetails">
              <h2 className="title">{product.title}</h2>
              <div className="priceSection">
                <del className="delPrice">Rs. {(product.price * 5).toFixed(2)}</del>
                <span className="price">Rs. {product.price.toFixed(2)}</span>
              </div>
              <p>Inclusive of all taxes Free Shipping.</p>
              <div className="rating">
                <span className="stars">★★★★☆</span> (16)
              </div>
              <div className="static-text">
                <img src={shopify} alt="Shopify icon" className="static-symbol" />
                <p>88 units sold in last 7 days</p>
              </div>
              <div className="offer-box">
                <div className="offer-box__header">OFFERS</div>
                <div className="offer-box__content">
                  <div className="offer-box__discount">10% Off</div>
                  <div className="offer-box__code">
                    <div className="offer-box__code-label">Code:</div>
                    <div className="offer-box__code-text">GRAB10</div>
                  </div>
                </div>
                <div className="offer-box__footer">Use code at checkout</div>
              </div>
              <p>40 people watching this product currently</p>
              <div>
                <p className="color">Color: {product.color}</p>
                <div className="quantity">
                  <div className="quantityOpt">
                    <button onClick={decrement}>
                      <FaMinus />
                    </button>
                    <input
                      type="text"
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val > 0) {
                          setQuantity(val);
                        }
                      }}
                      value={quantity}
                    />
                    <button onClick={increment}>
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
              <div className="product-btns">
                <button 
                  onClick={handleAddToCartClick}
                  disabled={loadingCartProducts[id]}
                >
                  {loadingCartProducts[id] ? (
                    <span className="button-loader"></span>
                  ) : (
                    "ADD TO CART"
                  )}
                </button>
                <button className="exp" onClick={handleBuyNow}>
                  BUY NOW
                </button>
              </div>
            </div>
          </div>
          {showCheckout && (
            <Checkout
              product={{ ...product, quantity }}
              onClose={handleCloseCheckout}
            />
          )}
        </>
      )}
    </>
  );
};

export default ProductPage;