import React from 'react';
import image from '../assets/images/image.jpg'
// import heroVideo from '../assets/videos/video2.'

const HeroPageBackground = () => {
  return (
    <div className="hero-background">
      {/* <video
        autoPlay
        muted
        loop
        className="object-cover w-full min-h-screen"
      >
        <source src={heroVideo} type="video/mp4" />
      </video> */}
           <img
      className="object-cover w-full h-full"
    src={image}
    alt = "Background"
    />
  
    </div>
  );
};

export default HeroPageBackground;
