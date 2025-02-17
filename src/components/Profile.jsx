import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../scss/AdminPanel.scss';
import adminImg from '../assets/man.png';
import orderIcon from '../assets/ordericon.png';
import CountUp from 'react-countup';
import OrderHistory from './OrderHistory';

const Profile = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const [section, setSection] = useState('overview');
    const [orderCount, setOrderCount] = useState(0);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!id) {
            navigate('/login');
        } else {
            const token = localStorage.getItem('token');
            if (token) {
                axios.post('http://localhost:5000/api/check/verifyAccess', {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }).then((res) => {
                    if (res.data.success) {
                        axios.post('http://localhost:5000/api/profile', { id })
                            .then(response => {
                                setUser(response.data.user);
                            })
                            .catch(error => {
                                console.log(error);
                                navigate('/login');
                            });
                    }
                }).catch((err) => {
                    localStorage.removeItem('token');
                    console.log(err);
                    navigate('/login');
                });

            } else {
                navigate('/login');
            }
        }
    }, [id, navigate]);

    const fetchDetails = async () => {
        try {
            console.log("hii")
            const response = await axios.get(`http://localhost:5000/api/orders/orderDetails/${id}`);

            setOrderCount(response.data);

        } catch (error) {
            console.error('Error fetching details:', error);
        }
    };

    useEffect(() => {
        fetchDetails()
    }, [id, navigate]);

    if (!user) {
        return null;
    }

    const handleSectionClick = (selectedSection) => {
        setSection(selectedSection);

    };
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

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

            <div className="content">
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
    )
};

export default Profile;