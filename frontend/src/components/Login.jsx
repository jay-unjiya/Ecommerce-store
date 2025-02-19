import React, { useState, useEffect } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo2.png';
import { ToastContainer, toast } from 'react-toastify';
import Footer from './Footer';
import '../scss/Signup.scss';
import { useCart } from '../context/CartProvider';

const Login = () => {
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();
    const { syncCartAfterLogin, BASE_URL } = useCart();

    const handleLogin = async () => {
        try {
            setLoading(true); // Show loading spinner
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await axios.post(`${BASE_URL}/check/verifyAccess`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.data.success) {
                const userId = res.data.id;
                await syncCartAfterLogin(userId);
                navigate('/');
            }
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setLoading(false); // Hide loading spinner
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const adminToken = localStorage.getItem('admin-token');

        if (token || adminToken) {
            const endpoint = token ? `${BASE_URL}/check/verifyAccess` : `${BASE_URL}/check/verifyAdminAccess`;
            const authToken = token || adminToken;

            axios.post(endpoint, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                }
            }).then(() => {
                toast("You are already logged in");
                setTimeout(() => navigate('/'), 2000);
            }).catch((err) => {
                console.error('Token verification failed:', err);
                localStorage.removeItem('token');
                localStorage.removeItem('admin-token');
            });
        }
    }, [navigate]);

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true); // Show loading spinner
            try {
                const endpoint = `${BASE_URL}/auth/login`;
                const response = await axios.post(endpoint, {
                    email: values.email,
                    password: values.password,
                });

                if (response.data.success) {
                    const isAdminRole = response.data.role === "admin";
                    const tokenKey = isAdminRole ? 'admin-token' : 'token';
                    localStorage.setItem(tokenKey, response.data.data.token);
                    handleLogin();
                    navigate(isAdminRole ? '/admin' : '/');
                } else {
                    alert('Login failed. Please try again.');
                }
            } catch (err) {
                console.error('Login failed:', err);
                alert('Login failed. Please try again.');
            } finally {
                setLoading(false); // Hide loading spinner
            }
        },
    });

    return (
        <>
            <ToastContainer />
            <div className="form-container">
                <form onSubmit={formik.handleSubmit} className="form">
                    <div className="form-header">
                        <img src={logo} alt="Logo" width="80" height="80" className="logo" />
                        <h2>Login Form</h2>
                    </div>
                    <input
                        type="text"
                        className='form-control'
                        name="email"
                        placeholder='Enter your email'
                        value={formik.values.email}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.email && formik.errors.email && <div className='Error'>{formik.errors.email}</div>}

                    <input
                        type="password"
                        className='form-control'
                        name="password"
                        placeholder='Enter your password'
                        value={formik.values.password}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.password && formik.errors.password && <div className='Error'>{formik.errors.password}</div>}

                    <button className="submit-button" type="submit">
                        {loading ? (
                            <span className="button-loader"></span>  // Display loader
                        ) : (
                            'Login'  // Button text when not loading
                        )}
                    </button>
                    <button type="button" onClick={() => navigate('/signup')}>
                        New to the website? <span>SignUp</span>
                    </button>
                </form>
            </div>
        </>
    );
};

export default Login;
