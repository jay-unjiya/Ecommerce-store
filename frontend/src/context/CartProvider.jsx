import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [checkbox, setCheckbox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCartProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (token) {
        const res = await axios.post('http://localhost:5000/api/check/verifyAccess', {}, {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (res.data.success) {
          const userId = res.data.id;
          const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
          const data = await response.json();
          if (data.success) {
            const productDetails = await Promise.all(
              data.cart.map(async ({ productId, quantity }) => {
                const res = await fetch(`http://localhost:5000/api/products/${productId}`);
                const productData = await res.json();
                return { ...productData, quantity };
              })
            );
            setProducts(productDetails);
          }
        }
      } else {
        const savedProducts = localStorage.getItem('products');
        const productIds = savedProducts ? JSON.parse(savedProducts) : [];

        const productDetails = await Promise.all(
          productIds.map(async ({ productId, quantity }) => {
            const res = await fetch(`http://localhost:5000/api/products/${productId}`);
            const productData = await res.json();
            return { ...productData, quantity };
          })
        );

        setProducts(productDetails);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

    
  const checkAdminLogin = () => {
    const adminToken = localStorage.getItem('admin-token');
    if (adminToken) {
      axios.post('http://localhost:5000/api/check/verifyAdminAccess', {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      }).then(() => {
        setIsAdmin(true);
      }).catch((err) => {
        localStorage.removeItem('admin-token');
        console.error(err);
      });
    }
  };

  useEffect(() => {
    checkAdminLogin();
    fetchCartProducts();
  }, [location.pathname]);

  const saveCartToDatabase = async (updatedProducts) => {
    try {
      console.log(updatedProducts)
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.post('http://localhost:5000/api/check/verifyAccess', {}, {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (res.data.success) {
          const userId = res.data.id;
          await axios.post('http://localhost:5000/api/cart/save', {
            userId,
            items: updatedProducts.map(product => ({ productId: product._id, quantity: product.quantity }))
          });
        }
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };


   const handleCartUpdate = async ({ item, quantity, openCart }) => {
    try {
 
      const savedProducts = localStorage.getItem('products');
      const currentProducts = savedProducts ? JSON.parse(savedProducts) : [];
      const existingProduct = currentProducts.find(product => product.productId === item._id);
      let updatedProducts;

      if (existingProduct) {
        updatedProducts = currentProducts.map(product =>
          product.productId === item._id 
            ? { ...product, quantity: product.quantity + quantity } 
            : product
        ).filter(product => product.quantity > 0);
      } else {
        updatedProducts = [...currentProducts, { productId: item._id, quantity }];
      }

      localStorage.setItem('products', JSON.stringify(updatedProducts));

      const newProduct = { ...item, quantity };
      setProducts(prevProducts => {
        const existingProductIndex = prevProducts.findIndex(p => p._id === item._id);
        if (existingProductIndex >= 0) {
          const updatedProducts = [...prevProducts];
          updatedProducts[existingProductIndex] = {
            ...updatedProducts[existingProductIndex],
            quantity: updatedProducts[existingProductIndex].quantity + quantity
          };
          return updatedProducts.filter(product => product.quantity > 0);
        }
        return [...prevProducts, newProduct];
      });

      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.post('http://localhost:5000/api/check/verifyAccess', {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.data.success) {
          const userId = res.data.id;
          if (updatedProducts.length > 0) {
            await axios.post('http://localhost:5000/api/cart/save', {
              userId,
              items: updatedProducts.map(product => ({
                productId: product.productId,
                quantity: product.quantity
              }))
            });
          } else {
            await axios.delete('http://localhost:5000/api/cart/clear', { data: { userId } });
          }
        }
      }

      if (openCart) openCart();
    } catch (error) {
      console.error('Error handling cart:', error);
    }
  };


  const handleAddToCart = async (productId, quantity, openCart) => {
    try {
      const productResponse = await fetch(`http://localhost:5000/api/products/${productId}`);
      const productData = await productResponse.json();

      const savedProducts = localStorage.getItem('products');
      const currentProducts = savedProducts ? JSON.parse(savedProducts) : [];
      const existingProduct = currentProducts.find(item => item.productId === productId);
      let updatedProducts;

      if (existingProduct) {
        updatedProducts = currentProducts.map(item =>
          item.productId === productId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        updatedProducts = [...currentProducts, { productId, quantity }];
      }

      localStorage.setItem('products', JSON.stringify(updatedProducts));

      setProducts(prevProducts => {
        const existingProductIndex = prevProducts.findIndex(p => p._id === productId);
        if (existingProductIndex >= 0) {
          const newProducts = [...prevProducts];
          newProducts[existingProductIndex] = {
            ...newProducts[existingProductIndex],
            quantity: newProducts[existingProductIndex].quantity + quantity
          };
          return newProducts;
        }
        return [...prevProducts, { ...productData, quantity }];
      });
      if (openCart) openCart();


      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.post('http://localhost:5000/api/check/verifyAccess', {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.data.success) {
          const userId = res.data.id;
          await axios.post('http://localhost:5000/api/cart/save', {
            userId,
            items: updatedProducts.map(product => ({
              productId: product.productId,
              quantity: product.quantity
            }))
          });
        }
      }

    } catch (error) {
      console.error('Error handling cart:', error);
    }
  };
  
  const syncCartAfterLogin = async (userId) => {
    try {
      const localCart = JSON.parse(localStorage.getItem('products')) || [];
      
      const dbCartRes = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      let dbCart = [];
      
      if (dbCartRes.data.success) {
        dbCart = dbCartRes.data.cart;
      }

      const cartMap = new Map();
      [...localCart, ...dbCart].forEach(({ productId, quantity }) => {
        cartMap.set(productId, (cartMap.get(productId) || 0) + quantity);
      });

      const mergedCart = Array.from(cartMap, ([productId, quantity]) => ({ 
        productId, 
        quantity 
      }));

      await axios.post('http://localhost:5000/api/cart/save', { 
        userId, 
        items: mergedCart 
      });

      localStorage.setItem('products', JSON.stringify(mergedCart));

      await fetchCartProducts(true);
    } catch (error) {
      console.error('Error syncing cart after login:', error);
    }
  };
  const manageCartSignup = async()=>{
    const localCart = JSON.parse(localStorage.getItem('products')) || [];
    await axios.post('http://localhost:5000/api/cart/save', { 
      userId, 
      items: mergedCart 
    });
  }

  const handleRemove = (id) => {
    const updatedProducts = products.filter((product) => product._id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts.map(({ _id, quantity }) => ({ productId: _id, quantity }))));
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return handleRemove(id);

    const updatedProducts = products.map(product =>
      product._id === id ? { ...product, quantity: newQuantity } : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts.map(({ _id, quantity }) => ({ productId: _id, quantity }))));
  };

  const calculateSubtotal = () => products.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  const handleSubmitCart = (closeNav) => {
    if (checkbox) {
      closeNav()
      navigate('/viewcart');
    } else {
      alert("Please agree to the terms and conditions to proceed.");
    }
  };

  useEffect(() => {
    saveCartToDatabase(products);
  }, [products]);

  return (
    <CartContext.Provider value={{ 
      products, loading, checkbox, setCheckbox, handleAddToCart,handleRemove,syncCartAfterLogin,
      handleQuantityChange, calculateSubtotal, handleSubmitCart,handleCartUpdate,isAdmin,setIsAdmin
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
