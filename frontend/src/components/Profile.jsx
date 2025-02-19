import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../scss/AdminPanel.scss';
import adminImg from '../assets/man.png';
import orderIcon from '../assets/ordericon.png';
import CountUp from 'react-countup';
import OrderHistory from './OrderHistory';
import { useCart } from '../context/CartProvider';
import TableLoader from '../components/TableLoader';

const Profile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [section, setSection] = useState('overview');
    const [orderCount, setOrderCount] = useState(0);
    const [user, setUser] = useState(null);
    const { BASE_URL } = useCart();
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        if (!id) {
            navigate('/login');
        } else {
            const token = localStorage.getItem('token');
            if (token) {
                axios.post(`${BASE_URL}/check/verifyAccess`, {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }).then((res) => {
                    if (res.data.success) {
                        axios.post(`${BASE_URL}/profile`, { id })
                            .then(response => {
                                setUser(response.data.user);
                                // Set loading to false after a 1 second delay
                                setTimeout(() => {
                                    setLoading(false);
                                }, 1000);
                            })
                            .catch(error => {
                                console.log(error);
                                setLoading(false);
                                navigate('/login');
                            });
                    }
                }).catch((err) => {
                    localStorage.removeItem('token');
                    console.log(err);
                    setLoading(false);
                    navigate('/login');
                });
            } else {
                setLoading(false);
                navigate('/login');
            }
        }
    }, [id, navigate, BASE_URL]);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/orders/orderDetails/${id}`);
            setOrderCount(response.data);
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchDetails();
        }
    }, [id, BASE_URL]);

    const handleSectionClick = (selectedSection) => {
        setSection(selectedSection);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (loading) {
        return <TableLoader />;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="admin-panel">
            <div className="sidebar">
                <div className="admin-header">
                    <img src={adminImg} alt="Admin" className="admin-img" />
                    <span>{user.firstName} {user.lastName}</span>
                </div>

                <button className="sidebar-btn" onClick={() => handleSectionClick('overview')}>Overview</button>
                <button className="sidebar-btn" onClick={() => handleSectionClick('orders')}>Orders</button>
                <button className="sidebar-btn" onClick={() => handleLogout()}>Logout</button>
            </div>

            <div className="admin-content">
                {section === 'overview' && (
                    <div className="cards">
                        <div className="card">
                            <img src={orderIcon} alt="Order Icon" className="icon-small" />
                            <div className="count">
                                <CountUp end={orderCount} duration={2} /> Orders
                            </div>
                        </div>
                    </div>
                )}
                {section === 'orders' && <OrderHistory userId={id} user={user} />}
            </div>
        </div>
    );
};

export default Profile;