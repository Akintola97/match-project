import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaChevronDown, FaChevronUp, FaUsers } from "react-icons/fa";
import Avatar from "../components/Avatar";

const Chat = () => {
  const [onlinePeople, setOnlinePeople] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [offlineUserData, setOfflineUserData] = useState([]);
  const [uId, setUid] = useState("");
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineCollapsed, setOnlineCollapsed] = useState(false);
  const [offlineCollapsed, setOfflineCollapsed] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isMobileUsersVisible, setIsMobileUsersVisible] = useState(true);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/user/userInfo");
        setUid(response.data.userId);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const response = await axios.get("/user/unreadCounts");
        setUnreadCounts(response.data);
      } catch (error) {
        console.error("Error fetching unread message counts:", error);
      }
    };

    if (uId) {
      fetchUnreadCounts();
    }
  }, [uId]);

  const connect = () => {
    if (uId) {
      try {
        const socket = new WebSocket("ws://localhost:5000/user");
        setWs(socket);
        socket.onopen = () => {
          console.log("WebSocket connection established");
        };

        socket.onmessage = (e) => {
          console.log("WebSocket message received:", e.data);
          const messageData = JSON.parse(e.data);
          if (messageData.type === "onlineUsers") {
            const onlineCounts = {};
            messageData.data.forEach((user) => {
              if (user.userId !== uId) {
                onlineCounts[user.userId] =
                  unreadCounts.online[user.userId] || 0;
              }
            });
            setOnlineUsers(messageData.data.map((user) => user.userId));
            setOnlinePeople(
              messageData.data.filter((user) => user.userId !== uId)
            );
            setUnreadCounts((prev) => ({
              ...prev,
              online: onlineCounts,
            }));
          } else if (messageData.type === "text") {
            if (messageData.sender !== uId) {
              setMessages((prev) => [...prev, { ...messageData }]);
              const countKey = onlineUsers.includes(messageData.sender)
                ? "online"
                : "offline";
              const updatedCount = {
                ...unreadCounts[countKey],
                [messageData.sender]:
                  (unreadCounts[countKey][messageData.sender] || 0) + 1,
              };
              setUnreadCounts((prev) => ({
                ...prev,
                [countKey]: updatedCount,
              }));
            }
          }
        };

        socket.onclose = () => {
          console.log("WebSocket connection closed. Reconnecting...");
          setTimeout(connect, 1000);
        };
        socket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };
      } catch (error) {
        console.error("WebSocket connection error:", error);
      }
    }
  };

  useEffect(() => {
    connect();
  }, [uId]);

  useEffect(() => {
    const fetchSearchSuggestions = async () => {
      try {
        const response = await axios.get(`/user/people?q=${searchQuery}`);
        setSearchSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
      }
    };

    if (searchQuery.trim() !== "") {
      fetchSearchSuggestions();
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery]);

  const handleSelectUserFromSearch = (userId) => {
    setSelectedUserIds(userId);
    setSearchQuery("");
    setSearchSuggestions([]);
    setUnreadCounts((prev) => ({ ...prev, [userId]: 0 }));
    fetchMessagesForContact(userId);
  };

  const selectContact = (userId) => {
    setSelectedUserIds(userId);
    setIsMobileUsersVisible(false);
    const countKey = onlineUsers.includes(userId) ? "online" : "offline";
    setUnreadCounts((prev) => ({
      ...prev,
      [countKey]: {
        ...prev[countKey],
        [userId]: 0,
      },
    }));
    fetchMessagesForContact(userId);
  };

  const fetchMessagesForContact = async (userId) => {
    try {
      const response = await axios.get(`/user/messages/${userId}`);
      setMessages(response.data);
      setUnreadCounts((prev) => ({
        ...prev,
        online: {
          ...prev.online,
          [userId]: 0,
        },
        offline: {
          ...prev.offline,
          [userId]: 0,
        },
      }));
    } catch (error) {
      console.error("Error fetching messages for contact:", error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          recipient: selectedUserIds,
          text: newMessageText,
          sender: uId,
        })
      );
      setNewMessageText("");
      setMessages((prev) => [
        ...prev,
        {
          sender: uId,
          recipient: selectedUserIds,
          text: newMessageText,
          createdAt: new Date().toISOString(),
        },
      ]);
    } else {
      console.error("WebSocket is not open.");
    }
  };

  const formatTimeStamp = (timeStamp) => {
    const date = new Date(timeStamp);
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day

    if (now - date > oneDay) {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } else {
      const hours = date.getHours();
      let minutes = date.getMinutes();
      minutes = isNaN(minutes) ? "00" : minutes < 10 ? "0" + minutes : minutes;
      const amPM = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedTime = `${formattedHours}:${minutes}${amPM}`;
      return formattedTime;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/user/people");
      const filteredData = response.data.filter((person) => person._id !== uId);
      setOfflineUserData(
        filteredData.filter((person) => !onlineUsers.includes(person._id))
      );
    };
    fetchData();
  }, [uId, onlineUsers]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setIsSuggestionsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const selectedUser = selectedUserIds
    ? onlinePeople.find((user) => user.userId === selectedUserIds) ||
      offlineUserData.find((user) => user._id === selectedUserIds)
    : null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-0 w-full h-[100vh] pt-[8vh]">
      {isMobileUsersVisible ? null : (
        <button
          className="md:hidden absolute top-2 right-2 z-50 p-2 bg-gray-700 text-white rounded-full"
          onClick={() => setIsMobileUsersVisible(true)}
        >
          <FaUsers className="cursor-pointer text-2xl" />
        </button>
      )}
      <div
        className={`bg-gray-800 md:col-span-1 lg:col-span-1 flex flex-col h-full ${
          isMobileUsersVisible ? "" : "hidden"
        } md:block overflow-y-scroll`}
      >
        {/* Search input and suggestions */}
        <div className="p-2 relative" ref={searchInputRef}>
          <input
            type="text"
            placeholder="Search Users..."
            className="w-full p-2 border rounded-lg focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSuggestionsOpen(true)}
          />
          {searchSuggestions.length > 0 && isSuggestionsOpen && (
            <div className="absolute top-full left-0 bg-gray-700 border rounded-lg mt-1 w-full max-h-40 overflow-y-auto z-10 suggestion-dropdown">
              {searchSuggestions.map((user) => (
                <div
                  key={user._id}
                  className="p-2 cursor-pointer text-white hover:bg-black"
                  onClick={() => handleSelectUserFromSearch(user._id)}
                >
                  {user.firstName}
                </div>
              ))}
            </div>
          )}
        </div>
  
        {/* Online and Offline users lists */}
        <div className="p-2 w-full flex flex-col items-center justify-center">
          {/* Online users */}
          <div className="font-bold md:border md:rounded-lg md:border-black w-full p-2 text-left mb-2 bg-transparent">
            <div
              className="flex h-full justify-between items-center text-white cursor-pointer"
              onClick={() => setOnlineCollapsed(!onlineCollapsed)}
            >
              Online Users ({Math.max(0, onlineUsers.length - 1)})
              {onlineCollapsed ? <FaChevronDown /> : <FaChevronUp />}
            </div>
          </div>
          {!onlineCollapsed && (
            <div className="w-full overflow-y-scroll md:border-black md:rounded-lg shadow-md bg-transparent">
              <div className="p-2 text-left h-full overflow-y-scroll">
                {onlinePeople.map((user) => (
                  <div
                    onClick={() => selectContact(user.userId)}
                    key={user.userId}
                    className="p-2 text-white hover:bg-black transition duration-300 flex items-center"
                  >
                    <Avatar
                      online={true}
                      username={user.username}
                      userId={user.userId}
                      unreadCount={unreadCounts[user.userId] || 0}
                    />
                    <h1 className="capitalize text-white">{user.username}</h1>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Offline users */}
          <div className="font-bold md:border md:rounded-lg md:border-black w-full p-2 text-left mb-2 bg-transparent">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setOfflineCollapsed(!offlineCollapsed)}
            >
              <h1 className="p-2 text-white">
                Offline Users ({offlineUserData.length})
              </h1>
              {offlineCollapsed ? <FaChevronDown /> : <FaChevronUp />}
            </div>
          </div>
          {!offlineCollapsed && (
            <div className="w-full overflow-y-scroll md:border-black md:rounded-lg shadow-md bg-transparent">
              <div className="p-2 text-left text-white overflow-y-scroll">
                {offlineUserData.map((user) => (
                  <div
                    key={user._id}
                    className="p-2 hover:bg-black transition duration-300 flex items-center"
                    onClick={() => selectContact(user._id)}
                  >
                    <Avatar
                      online={false}
                      username={user.firstName}
                      userId={user._id}
                      unreadCount={unreadCounts[user._id] || 0}
                    />
                    <h1 className="capitalize text-white">{user.firstName}</h1>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className={`md:col-span-2 lg:col-span-1 h-full bg-gray-700 ${
          isMobileUsersVisible ? "hidden" : ""
        } md:block overflow-hidden`} // Changed to overflow-hidden
      >
        {selectedUserIds && (
          <div className="w-full border-b p-3 border-black text-white rounded-lg sticky top-0 z-10 bg-gray-700">
            <div className="flex items-center">
              <Avatar
                online={onlineUsers.includes(selectedUser._id || selectedUser.userId)}
                username={selectedUser.username || selectedUser.firstName}
                userId={selectedUser._id || selectedUser.userId}
                unreadCount={unreadCounts[selectedUser._id || selectedUser.userId] || 0}
              />
              <h1 className="font-bold capitalize ml-2">{selectedUser.username || selectedUser.firstName}</h1>
            </div>
          </div>
        )}
        {/* Chat container and message input field */}
        <div className="flex flex-col h-full">
          <div className="flex-grow overflow-y-scroll p-4" id="chat-Container">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === uId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-full md:max-w-xs lg:max-w-md xl:max-w-lg p-3 py-2 mb-2 rounded-lg ${message.sender === uId ? "bg-blue-500 text-white" : "bg-white text-gray-800"}`}
                >
                  <h1>{message.text}</h1>
                  <div className="text-[0.75rem] text-gray-400">
                    {formatTimeStamp(message.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {selectedUserIds && (
            <div className="mt-auto p-2 flex items-center rounded-lg w-full bg-white sticky bottom-0">
              <input
                type="text"
                value={newMessageText}
                onChange={(ev) => setNewMessageText(ev.target.value)}
                placeholder="Type Your Message Here"
                className="flex-grow p-2 text-black border rounded-lg focus:outline-none"
              />
              <button
                type="submit"
                className="ml-4 bg-blue-500 p-2 border rounded-lg text-white"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
};
export default Chat;
