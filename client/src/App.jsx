// import Login from "./components/Login";
// import Navbar from "./components/Navbar";
// import Register from "./components/Register";
// import { Routes, Route, Navigate } from "react-router-dom";
// import HeroPage from "./pages/HeroPage";
// import axios from "axios";
// import AuthProvider, { useAuth } from "./AuthContext";
// import Profile from "./components/Profile";
// import Trending from "./components/Trending";
// import Chat from "./components/Chat";
// // import Location from "./components/Location";
// import Store from "./components/Store";
// import Cart from "./components/Cart";

// axios.defaults.withCredentials = true;

// function PrivateRoute({ element }) {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
//       </div>
//     );
//   }

//   return user ? element : <Navigate to="/login" />;
// }

// function App() {
//   return (
//     <div>
//       <AuthProvider>
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<Register />} />
//           <Route path="/login" element={<Login />} />
//           <Route
//             path="/hero"
//             element={<PrivateRoute element={<HeroPage />} />}
//           />
//           <Route path="/trending" element={<Trending />} />
//           <Route
//             path="/profile"
//             element={<PrivateRoute element={<Profile />} />}
//           />
//           <Route path="/chat" element={<PrivateRoute element={<Chat />} />} />
//           {/* <Route
//             path="/location"
//             element={<PrivateRoute element={<Location />} />}
//           /> */}
//           <Route path = '/cart' element={<PrivateRoute element={<Cart />} />} />
//           <Route
//             path="/store"
//             element={<PrivateRoute element={<Store />} />}
//           />
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </AuthProvider>
//     </div>
//   );
// }

// export default App;


import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import AuthProvider, { useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import HeroPage from './pages/HeroPage';
import Trending from './components/Trending';
import Profile from './components/Profile';
import Chat from './components/Chat';
import Store from './components/Store';
import Cart from './components/Cart';

axios.defaults.withCredentials = true;

function PrivateRoute({ element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return user ? element : <Navigate to="/login" />;
}

function AdminRoute({ element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return user && user.role === 'admin' ? element : <Navigate to="/login" />;
}

function App() {
  return (
    <div>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hero" element={<PrivateRoute element={<HeroPage />} />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
          <Route path="/chat" element={<PrivateRoute element={<Chat />} />} />
          <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
          <Route path="/store" element={<AdminRoute element={<Store />} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
