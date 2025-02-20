import React from 'react';
import '../scss/Footer.scss';
import logo from '../assets/logo.png';
import { FaFacebook, FaEnvelope } from 'react-icons/fa';
import { FaInstagramSquare } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <img src={logo} alt="Logo" className="footer-logo" />
        </div>
        <div className="footer-columns">
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">Why Nervfit?</a></li>
              <li><a href="#">Warranty & Support</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Bulk Buy Enquiries</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Products</h3>
            <ul>
              <li><a href="#">Smart Watches</a></li>
              <li><a href="#">Wired Earphones</a></li>
              <li><a href="#">Storage Cards</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Policies</h3>
            <ul>
              <li><a href="#">Replacement & Refund Policy</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Shipping Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-email">
          <div className="input-container">
            <input type="email" placeholder="Your email address" />
            <FaEnvelope className="input-icon" />
          </div>
          <div className="footer-social">
            <FaFacebook className="social-icon" />
            <div className='instagram'>
            <svg class=" t4s-icon-instagram" role="presentation" viewBox="0 0 32 32"><path d="M15.994 2.886c4.273 0 4.775.019 6.464.095 1.562.07 2.406.33 2.971.552.749.292 1.283.635 1.841 1.194s.908 1.092 1.194 1.841c.216.565.483 1.41.552 2.971.076 1.689.095 2.19.095 6.464s-.019 4.775-.095 6.464c-.07 1.562-.33 2.406-.552 2.971-.292.749-.635 1.283-1.194 1.841s-1.092.908-1.841 1.194c-.565.216-1.41.483-2.971.552-1.689.076-2.19.095-6.464.095s-4.775-.019-6.464-.095c-1.562-.07-2.406-.33-2.971-.552-.749-.292-1.283-.635-1.841-1.194s-.908-1.092-1.194-1.841c-.216-.565-.483-1.41-.552-2.971-.076-1.689-.095-2.19-.095-6.464s.019-4.775.095-6.464c.07-1.562.33-2.406.552-2.971.292-.749.635-1.283 1.194-1.841s1.092-.908 1.841-1.194c.565-.216 1.41-.483 2.971-.552 1.689-.083 2.19-.095 6.464-.095zm0-2.883c-4.343 0-4.889.019-6.597.095-1.702.076-2.864.349-3.879.743-1.054.406-1.943.959-2.832 1.848S1.251 4.473.838 5.521C.444 6.537.171 7.699.095 9.407.019 11.109 0 11.655 0 15.997s.019 4.889.095 6.597c.076 1.702.349 2.864.743 3.886.406 1.054.959 1.943 1.848 2.832s1.784 1.435 2.832 1.848c1.016.394 2.178.667 3.886.743s2.248.095 6.597.095 4.889-.019 6.597-.095c1.702-.076 2.864-.349 3.886-.743 1.054-.406 1.943-.959 2.832-1.848s1.435-1.784 1.848-2.832c.394-1.016.667-2.178.743-3.886s.095-2.248.095-6.597-.019-4.889-.095-6.597c-.076-1.702-.349-2.864-.743-3.886-.406-1.054-.959-1.943-1.848-2.832S27.532 1.247 26.484.834C25.468.44 24.306.167 22.598.091c-1.714-.07-2.26-.089-6.603-.089zm0 7.778c-4.533 0-8.216 3.676-8.216 8.216s3.683 8.216 8.216 8.216 8.216-3.683 8.216-8.216-3.683-8.216-8.216-8.216zm0 13.549c-2.946 0-5.333-2.387-5.333-5.333s2.387-5.333 5.333-5.333 5.333 2.387 5.333 5.333-2.387 5.333-5.333 5.333zM26.451 7.457c0 1.059-.858 1.917-1.917 1.917s-1.917-.858-1.917-1.917c0-1.059.858-1.917 1.917-1.917s1.917.858 1.917 1.917z"></path></svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
