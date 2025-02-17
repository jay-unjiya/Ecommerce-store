import React from 'react';
import '../scss/ImageSection2.scss';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpg';
import img5 from '../assets/img5.jpg';

const ImageSection2 = () => {
  return (
    <div className="imageSection">
      {/* Left side - Full-height image */}
      <div className="leftImage">
        <img src={img1} alt="Full height" className="img" />
      </div>

      <div className="rightImages">
        <div className="firstCol">
          <img src={img2} alt="Top Left" className="img" />
          <img src={img4} alt="bottom Left" className="img" />
        </div>
        <div className="secCol">
          <img src={img3} alt="top Right" className="img" />
          <img src={img5} alt="Bottom Right" className="img" />
        </div>
      </div>
    </div>
  );
};

export default ImageSection2;
