import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../scss/AdminPanel.scss';
import { useCart } from '../context/CartProvider';

const AdminCategory = ({ category }) => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        title: '', image: '', price: '', description: '', brand: '', model: '', color: '', category: ''
    });
      const { BASE_URL } = useCart()
    
    const [isEditMode, setIsEditMode] = useState(false);
    console.log(category)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, [category]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = `${BASE_URL}/product`;

                if (category) {
                    url += `?category=${category}`;
                }
                const response = await axios.get(url);
                console.log(response)
                setProducts(response.data);

                if (response.data.length > 0) {
                    const headers = Object.keys(response.data[0]).filter(key => key !== '_id');
                    setHeaders(headers);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [category]);

    const handleSaveChanges = async () => {
        try {
            const formData = new FormData();
            Object.keys(currentProduct).forEach(key => {
                formData.append(key, currentProduct[key]);
            });

            if (isEditMode) {
                await axios.patch(`${BASE_URL}/updateProduct/${currentProduct._id}`, currentProduct);
                setProducts(products.map(product => (product._id === currentProduct._id ? currentProduct : product)));
            } else {
                const response = await axios.post(`${BASE_URL}/addProduct`, currentProduct);
                setProducts([response.data.data, ...products]);
            }

            setShowModal(false);
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleAddProduct = () => {
        setIsEditMode(false);
        setCurrentProduct({ title: '', image: '', price: '', description: '', brand: '', model: '', color: '', category: '' });
        setShowModal(true);
    };

    const handleEditProduct = (product) => {
        setIsEditMode(true);
        setCurrentProduct(product);
        setShowModal(true);
    };
    const handleCategoryChange = (e) => {
        if (e.target.value === 'new-category') {
            setCurrentProduct({ ...currentProduct, category: newCategory });
        } else {
            setCurrentProduct({ ...currentProduct, category: e.target.value });
        }
    };  

    const handleDeleteProduct = async (productId) => {
        try {
            await axios.delete(`${BASE_URL}/deleteProduct`, { data: { id: productId } });
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };
    const handleInputChange = (e) => {
        setCurrentProduct({ ...currentProduct, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h2>Categories</h2>

            <div className='top-section'>
                <button onClick={handleAddProduct} className="add-btn">Add Product</button>


            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        {headers.map((key) => (
                            <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index}>
                            {headers.map((key, idx) => (
                                <td key={idx}>
                                    {key === 'image' ? (
                                        <img src={product[key]} alt={product.title} className="product-image" />
                                    ) : key === 'description' ? (
                                        product[key].length > 50 ? `${product[key].substring(0, 50)}...` : product[key]
                                    ) : key === 'title' ? (
                                        product[key].length > 50 ? `${product[key].substring(0, 50)}...` : product[key]
                                    ) : (
                                        product[key]
                                    )}
                                </td>
                            ))}
                            <td className='action-btn'>
                                <button onClick={() => handleEditProduct(product)} className="update-btn">Update</button>
                                <button onClick={() => handleDeleteProduct(product._id)} className="delete-btn">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div id="overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={() => setShowModal(false)}>X</button>
                        <h2>{isEditMode ? 'Update' : 'Add'} Product</h2>
                        <label>Title</label>
                        <input type="text" name="title" value={currentProduct.title} onChange={handleInputChange} />
                        <label>Image</label>
                        <input type="text" name="image" value={currentProduct.image} onChange={handleInputChange} />
                        <label>Price</label>
                        <input type="text" name="price" value={currentProduct.price} onChange={handleInputChange} />
                        <label>Description</label>
                        <textarea name="description" value={currentProduct.description} onChange={handleInputChange}></textarea>
                        <label>Brand</label>
                        <input type="text" name="brand" value={currentProduct.brand} onChange={handleInputChange} />
                        <label>Model</label>
                        <input type="text" name="model" value={currentProduct.model} onChange={handleInputChange} />
                        <label>Color</label>
                        <input type="text" name="color" value={currentProduct.color} onChange={handleInputChange} />
                        <div className="category-selector">
                            <select className='add-btn' onChange={handleCategoryChange} value={currentProduct.category}>
                                <option value="" >Select Category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={handleSaveChanges} className="save-btn">Save Changes</button>
                        <button onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategory;
