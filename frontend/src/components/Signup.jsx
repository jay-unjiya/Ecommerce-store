import React, { useState, useEffect } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo2.png';
import { ToastContainer, toast } from 'react-toastify';
import '../scss/Signup.scss';
import { useCart } from "../context/CartProvider";

const Signup = () => {
    const [loading, setLoading] = useState(false);  // Add loading state
    const navigate = useNavigate();
    const { BASE_URL } = useCart();

    const saveCartToDatabase = async (userId) => {
        try {
            const savedProducts = localStorage.getItem('products');
            const productIds = savedProducts ? JSON.parse(savedProducts) : [];
            const items = productIds.map(({ productId, quantity }) => ({ productId, quantity }));

            await axios.post(`${BASE_URL}/cart/save`, { userId, items });
        } catch (error) {
            console.error('Error saving cart to database:', error);
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
                },
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
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true); // Show loading spinner
            try {
                const response = await axios.post(`${BASE_URL}/auth/signup`, {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password,
                });
                if (response.data.success) {
                    localStorage.setItem('token', response.data.data.token);
                    const userId = response.data.data.id;
                    await saveCartToDatabase(userId);
                    navigate('/');
                }
            } catch (err) {
                console.error('Signup failed:', err);
                alert('Signup failed. Please try again.');
            } finally {
                setLoading(false); // Hide loading spinner
            }
        },
    });

    return (
        <>
            <ToastContainer />
            <div className="form-container">
                <form className='form' onSubmit={formik.handleSubmit}>
                    <div className="form-header">
                        <img src={logo} alt="Logo" width="80" height="80" className="logo" />
                        <h2>SignUp Form</h2>
                    </div>
                    <input
                        type="text"
                        className='form-control'
                        name="firstName"
                        style={{ borderColor: (formik.errors.firstName ? 'red' : 'blue') }}
                        placeholder='Enter your firstname'
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.firstName && formik.errors.firstName && <div className='Error'>{formik.errors.firstName}</div>}

                    <input
                        type="text"
                        className='form-control'
                        name="lastName"
                        placeholder='Enter your lastname'
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.lastName && formik.errors.lastName && <div className='Error'>{formik.errors.lastName}</div>}

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
                            'Sign Up'  // Button text when not loading
                        )}
                    </button>
                    <button type="button" onClick={() => navigate('/login')}>
                        Already have an account? <span>Login</span>
                    </button>
                </form>
            </div>
        </>
    );
};

export default Signup;
