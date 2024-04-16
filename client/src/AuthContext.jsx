import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [uId, setUid] = useState(null);
  const [adminRole, setAdminRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/user/userinfo", {
        withCredentials: true,
      });
      setUid(response.data.userId);
      setAdminRole(response.data.role);
      setUser(response.data.firstName);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user info:", error);
      setUser(null);
      setUid(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const logout = async () => {
    try {
      await axios.get("/user/logout", { withCredentials: true });
      setUser(null);
      setUid(null);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    let socket;
    if (uId) {
      socket = new WebSocket("ws://localhost:10001/user");
      socket.onopen = () => console.log("WebSocket connection established");

      socket.onmessage = (e) => {
        console.log("WebSocket message received");
        const messageData = JSON.parse(e.data);
        if (messageData.type === "text" && messageData.sender !== uId) {
          setUnreadCount((prevCount) => prevCount + 1);
        }
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed. Reconnecting...");
        if (uId) {
          setTimeout(() => {
            socket = new WebSocket("ws://localhost:10001/user");
          }, 1000);
        }
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
  }, [uId]);

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
        fetchData,
      }}
    >
      {!loading ? (
        children
      ) : (
        <div className="w-full min-h-screen pt-[10vh] bg-gray-900 flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
