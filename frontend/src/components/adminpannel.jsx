import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminProduct from './AdminProduct';
import AdminUser from './AdminUser';
import AdminOrder from './AdminOrder';
import '../scss/AdminPanel.scss';
import adminImg from '../assets/man.png';
import userIcon from '../assets/usericon.png';
import productIcon from '../assets/producticon.png';
import orderIcon from '../assets/ordericon.png';
import CountUp from 'react-countup';
import { useCart } from '../context/CartProvider';

const AdminPanel = () => {
    const navigate = useNavigate();
      const { BASE_URL } = useCart()

    const {isAdmin, setIsAdmin} = useCart();
    const [section, setSection] = useState('overview');
    const [userCount, setUserCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('admin-token');
        if (!token) {
            navigate('/login');
        } else {
            axios.post(`${BASE_URL}/check/verifyAdminAccess`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(() => {
                setIsAdmin(true);
            }).catch((err) => {
                localStorage.removeItem('admin-token');
                console.error(err);
                navigate('/login');
            });
        }
    }, [navigate]);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/details`);
                setUserCount(response.data.userCount);
                setProductCount(response.data.productCount);
                setOrderCount(response.data.orderCount);

            } catch (error) {
                console.error('Error fetching details:', error);
            }
        };

        if (isAdmin && section === 'overview') {
            fetchDetails();
        }
    }, [isAdmin, section]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    fetchCategories()
    useEffect(() => {
        if (isAdmin && section === 'products') {
            fetchCategories();
        }
    }, [isAdmin, section]);

    const handleSectionClick = (selectedSection) => {
        setSection(selectedSection);
        if (selectedSection !== 'products') {
            setSelectedCategory('');
        }
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleLogout = () => {
        localStorage.removeItem('admin-token');
        setIsAdmin(false)
        navigate('/login');
    };

    return isAdmin ? (
        <div className="admin-panel">
            <div className="sidebar">
                <div className="admin-header">
                    <img src={adminImg} alt="Admin" className="admin-img" />
                    <span>Jay Unjiya</span>
                </div>

                <button className="sidebar-btn" onClick={() => handleSectionClick('overview')}>Overview</button>

                <select className="sidebar-btn" onClick={() => handleSectionClick('products')} value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="">Products</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </select>

                <button className="sidebar-btn" onClick={() => handleSectionClick('users')}>Users</button>
                <button className="sidebar-btn" onClick={() => handleSectionClick('orders')}>Orders</button>
                <button className="sidebar-btn" onClick={() => handleLogout()}>Logout</button>
            </div>

            <div className="content">
                {section === 'overview' && (
                    <div className="cards">
                        <div className="card">
                            <img src={userIcon} alt="User Icon" className="icon-small" />
                            <div className="count">
                                <CountUp end={userCount} duration={3} /> Users
                            </div>
                        </div>
                        <div className="card">
                            <img src={productIcon} alt="Product Icon" className="icon-small" />
                            <div className="count">
                                <CountUp end={productCount} duration={3} /> Products
                            </div>
                        </div>
                        <div className="card">
                            <img src={orderIcon} alt="Order Icon" className="icon-small" />
                            <div className="count">
                                <CountUp end={orderCount} duration={2} /> Orders
                            </div>
                        </div>
                    </div>
                )}
                {section === 'products' && <AdminProduct category={selectedCategory} />}
                {section === 'users' && <AdminUser />}
                {section === 'orders' && <AdminOrder />}
            </div>
        </div>
    ) : null;
};

export default AdminPanel;