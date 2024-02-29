// import React from 'react';
// import axios from 'axios';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../AuthContext';  
// import VideoBackground from './VideoBackground';

// const Register = () => {
//   const [firstName, setFirstName] = useState('');
//   const [password, setPassword] = useState('');
//   const [email, setEmail] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();
//   const { setUser } = useAuth(); 

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFirstName('');
//     setEmail('');
//     setPassword('');

//     const form_data = {
//       firstName,
//       email,
//       password,
//     };

//     try {
//       const register_user = await axios.post('/user/register', form_data);

//       if (register_user.status === 200) {
//         const login_user = await axios.post('/user/login', form_data);
//         if (login_user.status === 200) {
//           setUser(login_user.data.firstName);
//           navigate('/profile');
//         } else {
//           window.alert('Login after registration failed');
//         }
//       } else {
//         window.alert('Registration failed');
//       }
//     } catch (error) {
//       console.error('Registration Error:', error);
//       window.alert(
//         error.response?.data?.message || 'An error occurred during registration.'
//       );
//     }
//   };


  
//   return (
//     <div className="relative w-full min-h-screen">
//       <VideoBackground />
//       <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
//       <div className="bg-transparent p-12 rounded shadow-lg">
//         <h1 className='w-full h-full font-bold text-[4vmin] text-white p-5'>Register</h1>
//         <form onSubmit={handleSubmit} className='h-full'>
//           <div className='p-5 text-black'>
//             <input className="w-full rounded-lg py-2 px-3 focus:border-green-500" type='text' placeholder='First Name...' onChange={(e)=>setFirstName(e.target.value)} value={firstName}  required />
//           </div>
//           <div className='p-5 text-black'>
//             <input className="w-full rounded-lg py-2 px-3  focus:border-green-500" type='email' placeholder='Email...' onChange={(e)=>setEmail(e.target.value)} value={email}  required />
//           </div>
//           <div className='p-5 text-black flex'>
//             <div>
//             <input
//               className='w-full rounded-lg py-2 px-3 focus:border-green-500'
//               type={showPassword ? 'text' : 'password'}
//               placeholder='Password...'
//               onChange={(e) => setPassword(e.target.value)}
//               value={password}
//               required
//             />
//             <div >
//             <label className='w-full p-2'>
//               <input
//                 type='checkbox'
//                 checked={showPassword}
//                 onChange={() => setShowPassword(!showPassword)}
//                 className='ml-2 mt-4'
//               />
//             </label>
//             show password
//             </div>
//       </div>
//           </div>
//           <div>
//           <button
//           type="submit"
//           className="bg-green-500 hover:bg-green-600 text-white w-full font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-green active:bg-green-700 ml-2"
//         >
//           Submit
//         </button>
//           </div>
//         </form>
//       </div>
//       </div>
//     </div>
//   );
// };

// export default Register;


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import VideoBackground from './VideoBackground';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [zoomEffect, setZoomEffect] = useState(false); // New state for controlling the zoom effect
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form_data = {
      firstName,
      email,
      password,
    };

    try {
      const register_user = await axios.post('/user/register', form_data);

      if (register_user.status === 200) {
        const login_user = await axios.post('/user/login', { email, password });
        if (login_user.status === 200) {
          setUser(login_user.data.firstName);
          setZoomEffect(true); // Trigger the zoom effect upon successful registration
          setTimeout(() => {
            navigate('/profile');
          }, 800); // Delay the navigation to allow the zoom effect to complete
        } else {
          window.alert('Login after registration failed');
        }
      } else {
        window.alert('Registration failed');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      window.alert(
        error.response?.data?.message || 'An error occurred during registration.'
      );
    }
  };

  return (
    <div className={`relative w-full min-h-screen ${zoomEffect ? 'scale-125 transition-transform duration-700 ease-in-out' : ''}`}>
      <VideoBackground />
      <div className={`absolute top-0 left-0 w-full h-full flex items-center justify-center ${zoomEffect ? 'opacity-0 transition-opacity duration-700 ease-in-out' : 'transition-opacity duration-500 ease-in-out'}`}>
        <div className="bg-transparent p-12 rounded shadow-lg">
          <h1 className='font-bold text-[4vmin] text-white p-5'>Register</h1>
          <form onSubmit={handleSubmit} className='h-full'>
            <div className='p-5'>
              <input className="w-full rounded-lg py-2 px-3 focus:border-green-500" type='text' placeholder='First Name...' onChange={(e)=>setFirstName(e.target.value)} value={firstName} required />
            </div>
            <div className='p-5'>
              <input className="w-full rounded-lg py-2 px-3 focus:border-green-500" type='email' placeholder='Email...' onChange={(e)=>setEmail(e.target.value)} value={email} required />
            </div>
            <div className='p-5 flex'>
              <div>
                <input
                  className='w-full rounded-lg py-2 px-3 focus:border-green-500'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password...'
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
                <div>
                  <label className='w-full p-2'>
                    <input
                      type='checkbox'
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                      className='ml-2 mt-4'
                    />
                    show password
                  </label>
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white w-full font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-green active:bg-green-700 ml-2"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
