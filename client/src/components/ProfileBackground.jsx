import React from 'react'
import video2 from '../assets/videos/video2.mp4'

const ProfileBackground = () => {
  return (
    <div className="profile-background">
    <video
      autoPlay
      muted
      loop
      className="object-cover w-full min-h-screen"
    >
      <source src={video2} type="video/mp4" />
    </video>
  </div>
  )
}

export default ProfileBackground