import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/reducers';
import '../scss/ImageSection.scss';
import { useCart } from '../context/CartProvider';

function ImageSection() {
  const dispatch = useDispatch();
  const { isAdmin } = useCart(); // Destructure isAdmin from useCart
  const navigate = useNavigate();
  const data = useSelector((state) => state.products.products);
  const loading = useSelector((state) => state.products.loading);
  const errors = useSelector((state) => state.products.errors);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className='ImageSec'>
      <div className='Title'>
        <span>IT'S A NEW DAY EVERYDAY!</span>
      </div>
      <div className='Images'>
        {data && data.slice(25, 29).map((product, index) => (
          <img
            key={index}
            src={product.image}
            alt={`Product ${index + 1}`}
            {...(!isAdmin ? { onClick: () => navigate(`/product/${product._id}/`) } : {})}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageSection;
