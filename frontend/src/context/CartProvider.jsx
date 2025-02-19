import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [checkbox, setCheckbox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingCartProducts, setLoadingCartProducts] = useState({});
  const [preventSave, setPreventSave] = useState(false); // Flag to prevent auto-saving

  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = "https://ecommerce-store-backend-five.vercel.app/api";
  // const BASE_URL = "https://localhost:5000/api";

  const fetchCartProducts = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (token) {
        const res = await axios.post(`${BASE_URL}/check/verifyAccess`, {}, {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (res.data.success) {
          const userId = res.data.id;
          const response = await fetch(`${BASE_URL}/cart/${userId}`);
          const data = await response.json();
          if (data.success && data.cart && data.cart.length > 0) {
            const productDetails = await Promise.all(
              data.cart.map(async ({ productId, quantity }) => {
                const res = await fetch(`${BASE_URL}/products/${productId}`);
                const productData = await res.json();
                return { ...productData, quantity };
              })
            );
            setProducts(productDetails);
          } else {
            setProducts([]);
          }
        }
      } else {
        const savedProducts = localStorage.getItem('products');
        if (!savedProducts) {
          setProducts([]);
          return;
        }

        const productIds = JSON.parse(savedProducts);
        if (productIds.length === 0) {
          setProducts([]);
          return;
        }

        const productDetails = await Promise.all(
          productIds.map(async ({ productId, quantity }) => {
            const res = await fetch(`${BASE_URL}/products/${productId}`);
            const productData = await res.json();
            return { ...productData, quantity };
          })
        );

        setProducts(productDetails);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminLogin = () => {
    const adminToken = localStorage.getItem('admin-token');
    if (adminToken) {
      axios.post(`${BASE_URL}/check/verifyAdminAccess`, {}, {
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

  const saveCartToDatabase = async (products) => {
    try {
      // If preventSave flag is set or products array is empty, don't save
      if (preventSave || !products || products.length === 0) {
        return;
      }

      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.post(`${BASE_URL}/check/verifyAccess`, {}, {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (res.data.success) {
          const userId = res.data.id;
          await axios.post(`${BASE_URL}/cart/save`, {
            userId,
            items: products.map(product => ({ productId: product._id, quantity: product.quantity }))
          });
        }
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const handleCartUpdate = async ({ item, quantity, openCart }) => {
    try {
      setLoadingCartProducts(prev => ({ ...prev, [item._id]: true }));

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

      // Don't save empty arrays to localStorage
      if (updatedProducts.length > 0) {
        localStorage.setItem('products', JSON.stringify(updatedProducts));
      } else {
        localStorage.removeItem('products');
      }

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
        const res = await axios.post(`${BASE_URL}/check/verifyAccess`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.data.success) {
          const userId = res.data.id;
          if (updatedProducts.length > 0) {
            await axios.post(`${BASE_URL}/cart/save`, {
              userId,
              items: updatedProducts.map(product => ({
                productId: product.productId,
                quantity: product.quantity
              }))
            });
          } else {
            // If cart is empty, clear it from the database
            await axios.delete(`${BASE_URL}/cart/clear`, { data: { userId } });
          }
        }
      }

      if (openCart && typeof openCart === 'function') {
        openCart();
      }
    } catch (error) {
      console.error('Error handling cart:', error);
    } finally {
      setLoadingCartProducts(prev => ({ ...prev, [item._id]: false }));
    }
  };

  const handleAddToCart = async (productId, quantity, openCart) => {
    try {
      setLoadingCartProducts(prev => ({ ...prev, [productId]: true }));

      const productResponse = await fetch(`${BASE_URL}/products/${productId}`);
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
      
      if (openCart && typeof openCart === 'function') {
        openCart();
      }

      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.post(`${BASE_URL}/check/verifyAccess`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.data.success) {
          const userId = res.data.id;
          await axios.post(`${BASE_URL}/cart/save`, {
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
    } finally {
      setLoadingCartProducts(prev => ({ ...prev, [productId]: false }));
    }
  };

  const syncCartAfterLogin = async (userId) => {
    try {
      // Get local cart from localStorage
      const localCart = JSON.parse(localStorage.getItem('products')) || [];
      
      // Skip syncing if there's nothing in the local cart
      if (localCart.length === 0) {
        await fetchCartProducts();
        return;
      }
      
      // Fetch the database cart for the logged-in user
      const dbCartRes = await axios.get(`${BASE_URL}/cart/${userId}`);
      let dbCart = [];
      
      if (dbCartRes.data.success && dbCartRes.data.cart) {
        dbCart = dbCartRes.data.cart;
      }
      
      // Merge the carts, handling duplicates by adding quantities
      const cartMap = new Map();
      
      // Add all items from both carts to the Map
      [...localCart, ...dbCart].forEach(item => {
        const productId = item.productId;
        const currentQuantity = cartMap.get(productId) || 0;
        cartMap.set(productId, currentQuantity + item.quantity);
      });
      
      // Convert the Map back to an array
      const mergedCart = Array.from(cartMap, ([productId, quantity]) => ({
        productId,
        quantity
      }));
      
      // Only save if there are items in the merged cart
      if (mergedCart.length > 0) {
        // Save the merged cart to the database
        await axios.post(`${BASE_URL}/cart/save`, {
          userId,
          items: mergedCart
        });
        
        // Update localStorage with the merged cart
        localStorage.setItem('products', JSON.stringify(mergedCart));
      } else {
        // If merged cart is empty, clear from database and localStorage
        await axios.delete(`${BASE_URL}/cart/clear`, { data: { userId } });
        localStorage.removeItem('products');
      }
      
      // Refresh the cart display
      await fetchCartProducts();
    } catch (error) {
      console.error('Error syncing cart after login:', error);
    }
  };

  const handleRemove = async (id) => {
    try {
      // Set prevent save flag to avoid automatic save by the useEffect
      setPreventSave(true);
      
      const updatedProducts = products.filter((product) => product._id !== id);
      setProducts(updatedProducts);
      
      if (updatedProducts.length > 0) {
        const updatedLocalCart = updatedProducts.map(({ _id, quantity }) => ({ 
          productId: _id, 
          quantity 
        }));
        
        localStorage.setItem('products', JSON.stringify(updatedLocalCart));
        
        // Also update database if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.post(`${BASE_URL}/check/verifyAccess`, {}, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
          });
          
          if (res.data.success) {
            const userId = res.data.id;
            await axios.post(`${BASE_URL}/cart/save`, {
              userId,
              items: updatedLocalCart
            });
          }
        }
      } else {
        // If cart is now empty, clear it completely
        localStorage.removeItem('products');
        
        // Clear from database if logged in
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.post(`${BASE_URL}/check/verifyAccess`, {}, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
          });
          
          if (res.data.success) {
            const userId = res.data.id;
            await axios.delete(`${BASE_URL}/cart/clear`, { data: { userId } });
          }
        }
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    } finally {
      // Reset prevent save flag after operation completes
      setTimeout(() => setPreventSave(false), 100);
    }
  };

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity < 1) return handleRemove(id);

    try {
      // Set prevent save flag to avoid automatic save by the useEffect
      setPreventSave(true);
      
      const updatedProducts = products.map(product =>
        product._id === id ? { ...product, quantity: newQuantity } : product
      );
      
      setProducts(updatedProducts);
      
      const updatedLocalCart = updatedProducts.map(({ _id, quantity }) => ({ 
        productId: _id, 
        quantity 
      }));
      
      localStorage.setItem('products', JSON.stringify(updatedLocalCart));
      
      // Also update database if user is logged in
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.post(`${BASE_URL}/check/verifyAccess`, {}, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
          });
          
          if (res.data.success) {
            const userId = res.data.id;
            await axios.post(`${BASE_URL}/cart/save`, {
              userId,
              items: updatedLocalCart
            });
          }
        } catch (error) {
          console.error('Error updating cart in database after quantity change:', error);
        }
      }
    } catch (error) {
      console.error('Error changing quantity:', error);
    } finally {
      // Reset prevent save flag after operation completes
      setTimeout(() => setPreventSave(false), 100);
    }
  };

  const calculateSubtotal = () => products.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  const handleSubmitCart = (closeNav) => {
    if (checkbox) {
      if (closeNav && typeof closeNav === 'function') {
        closeNav();
      }
      navigate('/viewcart');
    } else {
      alert("Please agree to the terms and conditions to proceed.");
    }
  };

  const removeCart = async (userId) => {
    try {
      // Set prevent save flag to avoid automatic save by the useEffect
      setPreventSave(true);
      
      // Clear local state first
      localStorage.removeItem('products');
      setProducts([]);

      if (userId) {
        await axios.delete(`${BASE_URL}/cart/clear`, { data: { userId } });
      }

      await fetchCartProducts();
    } catch (error) {
      console.error('Error removing cart:', error);
    } finally {
      // Reset prevent save flag after operation completes
      setTimeout(() => setPreventSave(false), 100);
    }
  };

  useEffect(() => {
    if (!preventSave && products.length > 0) {
      saveCartToDatabase(products);
    }
  }, [products, preventSave]);

  return (
    <CartContext.Provider value={{
      products, 
      loading, 
      checkbox, 
      setCheckbox, 
      handleAddToCart, 
      handleRemove, 
      syncCartAfterLogin, 
      removeCart,
      handleQuantityChange, 
      calculateSubtotal, 
      handleSubmitCart, 
      handleCartUpdate, 
      isAdmin, 
      setIsAdmin, 
      BASE_URL,
      loadingCartProducts
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);