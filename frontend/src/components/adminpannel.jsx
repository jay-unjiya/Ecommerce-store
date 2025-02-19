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
import TableLoader from '../components/TableLoader';


const AdminPanel = () => {
    const navigate = useNavigate();
    const { BASE_URL } = useCart();
    const { isAdmin, setIsAdmin } = useCart();
    const [section, setSection] = useState('overview');
    const [userCount, setUserCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const token = localStorage.getItem('admin-token');
        if (!token) {
            navigate('/login');
        } else {
            setLoading(true); // Set loading to true when verifying admin access
            axios.post(`${BASE_URL}/check/verifyAdminAccess`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(() => {
                setIsAdmin(true);
                // Set loading to false after a 1 second delay
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }).catch((err) => {
                localStorage.removeItem('admin-token');
                console.error(err);
                setLoading(false);
                navigate('/login');
            });
        }
    }, [navigate, setIsAdmin, BASE_URL]);

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
    }, [isAdmin, section, BASE_URL]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        if (isAdmin && section === 'products') {
            fetchCategories();
        }
    }, [isAdmin, section, BASE_URL]);

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
        setIsAdmin(false);
        navigate('/');
    };

    if (loading) {
        return <TableLoader />;
    }

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

            <div className="admin-content">
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