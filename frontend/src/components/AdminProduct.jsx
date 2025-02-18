import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../scss/AdminPanel.scss';
import { GiSplitCross } from "react-icons/gi";
import { useCart } from '../context/CartProvider'
import TableLoader from '../components/TableLoader';
const AdminProduct = ({ category }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        title: '', image: '', price: '', description: '', brand: '', model: '', color: '', category: ''
    });
    const { BASE_URL } = useCart()

    const [isEditMode, setIsEditMode] = useState(false);
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/categories`);
            console.log("1")
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [category,showModal]);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                let url = `${BASE_URL}/product`;
                if (category) {
                    url += `?category=${category}`;
                }
                const response = await axios.get(url);
                setProducts(response.data);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    useEffect(() => {
        const overlay = document.getElementById('modelOverlay');

        if (showModal) {
            overlay.style.display = "block";
            document.body.style.overflow = 'hidden';
        } else {
            overlay.style.display = "none";
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showModal]);



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

    const handleDeleteProduct = async (productId) => {
        try {
            const confirmation = window.confirm('Are you sure you want to delete this product?');
            if (!confirmation) {
                return;
            }
            await axios.delete(`${BASE_URL}/deleteProduct`, { data: { id: productId } });
            setProducts(products.filter(product => product._id !== productId));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };


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

    const handleCategoryChange = (e) => {
        if (e.target.value === 'new') {
            setNewCategory(true);
            setCurrentProduct({ ...currentProduct, category: '' });
        } else {
            setNewCategory(false);
            setCurrentProduct({ ...currentProduct, category: e.target.value });
        }
    };



    const handleInputChange = (e) => {
        setCurrentProduct({ ...currentProduct, [e.target.name]: e.target.value });
    };

    const handleNewCategoryInput = (e) => {
        setCurrentProduct({ ...currentProduct, category: e.target.value });
    };

    const truncateText = (text, length) => {
        if (text.length > length) {
            return text.substring(0, length) + '...';
        }
        return text;
    };

    return (
        <div>
            <h2>Products</h2>
            <div id="modelOverlay"></div>
            <div className='top-section'>
                <button onClick={handleAddProduct} className="add-btn">Add Product</button>
            </div>
            <div className="table-loader-container">
                {isLoading ? (
                     <TableLoader rowsCount={8} />
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Image</th>
                                <th>Price</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={index}>
                                    <td>{(product.title).substring(0, 50)}</td>
                                    <td><img src={product.image} alt={product.title} className="product-image" /></td>
                                    <td>{(product.price).toFixed(2)}</td>
                                    <td>{(product.description).substring(0, 50)}</td>
                                    <td>{product.category}</td>
                                    <td className='action-btn'>
                                        <button onClick={() => handleEditProduct(product)} className="update-btn">Update</button>
                                        <button onClick={() => handleDeleteProduct(product._id)} className="delete-btn">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>


            {showModal && (
                <div className="modal-content">
                    <button className="close-btn" onClick={() => setShowModal(false)}><GiSplitCross /></button>
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
                            <option value="">Select Category</option>
                            <option value="new">Add New</option>
                            {categories.map((categorys, index) => (
                                <option key={index} value={categorys}>{categorys}</option>
                            ))}
                        </select>

                        {newCategory && (
                            <input
                                type="text"
                                placeholder="Enter new category"
                                value={currentProduct.category}
                                onChange={handleNewCategoryInput}
                            />
                        )}
                    </div>

                    <button onClick={handleSaveChanges} className="save-btn">Save Changes</button>
                    <button onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                </div>
            )}
        </div>
    );
};

export default AdminProduct;