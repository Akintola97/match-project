import React from 'react';
import video from '../assets/videos/video1.mp4'

const VideoBackground = () => {
  return (
    <div className="video-background">
      <video
        autoPlay
        muted
        loop
        className=" object-cover w-full h-[100vh]"
      >
        <source src={video} type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoBackground;
