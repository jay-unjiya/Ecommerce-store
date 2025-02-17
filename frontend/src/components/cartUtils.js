import axios from 'axios';

export const handleCartUpdate = async ({ item, quantity, openCart }) => {
  try {
    const savedProducts = localStorage.getItem('products');
    const currentProducts = savedProducts ? JSON.parse(savedProducts) : [];
    const existingProduct = currentProducts.find(product => product.id === item._id);
    let updatedProducts;

    if (existingProduct) {
      updatedProducts = currentProducts.map(product =>
        product.id === item._id ? { ...product, quantity: product.quantity + quantity } : product
      ).filter(product => product.quantity > 0);
    } else {
      updatedProducts = [...currentProducts, { id: item._id, quantity }];
    }

    localStorage.setItem('products', JSON.stringify(updatedProducts));
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

        if (updatedProducts.length > 0) {
          await axios.post('http://localhost:5000/api/cart/save', {
            userId,
            items: updatedProducts.map(product => ({
              productId: product.id,
              quantity: product.quantity
            }))
          });
        } else {
          await axios.delete('http://localhost:5000/api/cart/clear', { data: { userId } });
        }
      }
    }
  } catch (error) {
    console.error('Error handling cart:', error);
  }
};
