import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sale from './components/Sale';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Collection from './components/Collection';
import ProductPage from './components/ProductPage';
import ViewCart from './components/viewCart';
import Signup from './components/Signup';
import Login from './components/Login';
import Confirm from './components/confirm';
import AdminPanel from './components/adminpannel';
import Profile from './components/Profile';
import { CartProvider } from './context/CartProvider'; // Import the provider

const App = () => {
  return (
    <CartProvider> {/* Wrap the entire app in CartProvider */}
      <Sale />
      <Navbar />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/viewcart" element={<ViewCart />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </div>
      <Footer />
    </CartProvider>
  );
};

export default App;
