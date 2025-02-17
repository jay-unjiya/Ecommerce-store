import React, { useState, useEffect } from 'react';
import '../scss/Carousel.scss';
import img1 from '../assets/Cimg1.jpg';
import img2 from '../assets/Cimg2.jpg';

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [img1, img2];
   

    useEffect(() => {
        const interval = setInterval(() => {
                 setCurrentIndex((prevIndex) => (prevIndex === 0 ? 1 : 0)); 
            }, 2000);

        return () => clearInterval(interval);
    }, [images.length]);
 
    
    return (
        <div className="carousel">
          
            {images.map((img, index) => (
                <div
                    className="carousel__slide"
                    key={index}
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    <img src={img} alt={`Image ${index + 1}`} />
                </div>
))}
           
        </div>
    );
};

export default Carousel;
