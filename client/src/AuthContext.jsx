import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';





const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [uId, setUid] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/user/userinfo');
      setUser(response.data.firstName);
      setUid(response.data.userId);
    } catch (error) {
      setUser(null);
      console.log(error);
    }
  };


  const logout = async () => {
    try {
      await axios.get('/user/logout', {
        withCredentials: true,
      })
      setUser(null);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, uId, setUid }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
