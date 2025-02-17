import React, { useEffect } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo2.png';
import Footer from './Footer';
import '../scss/Signup.scss';
import { useCart } from "../context/CartProvider";
const AdminLogin = () => {
    const navigate = useNavigate();
      const { BASE_URL } = useCart()

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
            try {
                const response = await axios.post(`${BASE_URL}/auth/admin/login/`, {
                    email: values.email,
                    password: values.password,
                });
                if (response.data.success) {
                    localStorage.setItem('admin-token', response.data.data.token);
                    navigate('/admin');
                }
            } catch (err) {
                console.error('Login failed:', err);
                alert('Login failed. Please try again.');
            }
        },
    });

    return (
        <>
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

                    <button className="submit-button" type="submit">Login</button>
                    <button type="button" onClick={() => navigate('/signup')}>New to the website? <span>SignUp</span></button>
                </form>
            </div>
        </>
    );
}

export default AdminLogin;
