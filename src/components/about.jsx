import React from 'react';
import quality from '../assets/quality.svg';
import delivary from '../assets/delivary.svg';
import warranty from '../assets/warranty.svg';
import replace from '../assets/replacement.svg';
import rupee from '../assets/rupee.png';
import '../scss/About.scss';

const About = () => {
  return (
    <div className='about-container'>
      <div className='container-item'>
        <div className="img-container">
          <img src={quality} alt="Quality" />
        </div>
        <span>TOP NOTCH QUALITY</span>
      </div>

      <div className='container-item'>
        <div className="img-container">
          <img src={delivary} alt="Delivery" />
        </div>
        <span>SAFE & FAST DELIVERY</span>
      </div>

      <div className='container-item'>
        <div className="img-container">
          <img src={warranty} alt="Warranty" />
        </div>
        <span>1 YEAR WARRANTY</span>
      </div>

      <div className='container-item'>
        <div className="img-container">
          <img src={rupee} alt="Rupee" />
        </div>
        <span>QUICK REFUNDS</span>
      </div>

      <div className='container-item'>
        <div className="img-container">
          <img src={replace} alt="Replacement" />
        </div>
        <span>7 DAYS REPLACEMENT</span>
      </div>
    </div>
  );
};

export default About;
