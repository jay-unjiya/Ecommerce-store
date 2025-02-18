import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../scss/Navbar.scss';
import logo from '../assets/logo.png';
import { FaBars, FaRegUser } from 'react-icons/fa';
import { IoCartOutline } from 'react-icons/io5';
import Cart from './Cart';
import { useCart } from '../context/CartProvider';

export const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("overlay").style.display = "none";
  document.body.style.overflow = "auto";
};

export const openCart = () => {
  document.getElementById("mySidenav").style.width = "340px";
  document.getElementById("overlay").style.display = "block";
  document.body.style.overflow = "hidden";
};

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {isAdmin,setIsAdmin} = useCart()
  const { BASE_URL } = useCart()


  useEffect(() => {
    const adminToken = localStorage.getItem('admin-token');
    if (adminToken) {
      axios.post(`${BASE_URL}/check/verifyAdminAccess`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleUserIconClick = () => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('admin-token');
    if (adminToken) {
      axios.post(`${BASE_URL}/check/verifyAdminAccess`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      }).then(() => {
        navigate('/admin');
      }).catch((err) => {
        localStorage.removeItem('admin-token');
        console.error(err);
        navigate('/login');
      });
    } else if (token) {
      axios.post(`${BASE_URL}/check/verifyAccess`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then((res) => {
        if (res.data.success) {
          navigate(`/profile/${res.data.id}`);
        }
      }).catch((err) => {
        localStorage.removeItem('token');
        console.log(err);
        navigate('/login');
      });
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">  
      <div className='overlay' id='overlay' onClick={closeNav}></div>
      <div className='sidenav' id='mySidenav'>
        <Cart />
      </div>
      <div className="navbar_logo">
        <img src={logo} alt="Logo" onClick={() => navigate('/')} />
      </div>
      <div className={`navbar_links ${isMenuOpen ? 'navbar__links--open' : ''}`}>
        <Link to='/'>Home</Link>
        {!isAdmin && <Link to='/Collection'>Collection</Link>}
        <Link to='/'>Contact</Link>
      </div> 
      <div className="navbar__icons">
        <FaRegUser className="icon" onClick={handleUserIconClick} />
        {!isAdmin && <IoCartOutline className="icon" onClick={() => openCart()} />}
        <FaBars className="menu-icon" onClick={toggleMenu} />
      </div>
    </nav>
  );
};

export default Navbar;
