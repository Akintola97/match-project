import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [uId, setUid] = useState("");
  const [adminRole, setAdminRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/user/userinfo", {withCredentials:true});
      setAdminRole(response.data.role);
      setUser(response.data.firstName);
      setUid(response.data.userId);
      setLoading(false);
    } catch (error) {
      setUser(null);
      console.log(error);
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get("/user/logout", {
        withCredentials: true,
      });
      setUser(null);
      window.location.reload();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let socket;
    console.log(uId)
    if (uId) {
      socket = new WebSocket("ws://localhost:5000/user");
      socket.onopen = () => {
        console.log("WebSocket connection established");
      };

      socket.onmessage = (e) => {
        console.log("WebSocket message received:", e.data);
        const messageData = JSON.parse(e.data);
        if (messageData.type === "text" && messageData.sender !== uId) {
          // Increment unread count if the message is not from the current user
          setUnreadCount((prevCount) => prevCount + 1);
        }
      };
      socket.onclose = () => {
        console.log("WebSocket connection closed. Reconnecting...");
        setTimeout(() => {
          if (uId) {
            // Only reconnect if the user ID is still set (i.e., the user is still logged in)
            socket = new WebSocket("ws://localhost:5000/user");
          }
        }, 1000);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [uId]); // Re-establish WebSocket connection if the user ID changes

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        logout,
        uId,
        setUid,
        adminRole,
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
