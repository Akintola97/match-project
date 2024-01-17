import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import {Routes, Route, Navigate} from 'react-router-dom';
import HeroPage from "./pages/HeroPage";
import axios from 'axios';
import AuthProvider, {useAuth} from "./AuthContext";
import Profile from './components/Profile';
import Trending from "./components/Trending";
import Chat from './components/Chat';
import Location from "./components/Location";




axios.defaults.withCredentials = true;

function PrivateRoute({ element }) {
  const { user } = useAuth();

  return user ? element : <Navigate to="/login" />;
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
           <Route path="/location" element={<PrivateRoute element={<Location/>} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
