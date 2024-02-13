import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Avatar from "../components/Avatar";

const Chat = () => {
  const [onlinePeople, setOnlinePeople] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [offlineUserData, setOfflineUserData] = useState([{}]);
  const [uId, setUid] = useState("");
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineCollapsed, setOnlineCollapsed] = useState(false);
  const [offlineCollapsed, setOfflineCollapsed] = useState(false);
  const [lastMessage, setLastMessage] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [fetchMessages, setFetchMessages] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/user/userInfo");
        setUid(response.data.userId);
        setUser(response.data.firstName);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    connect();
  }, [uId]);

  const connect = () => {
    if (uId) {
      try {
        const socket = new WebSocket("ws://localhost:5000/user");
        setWs(socket);
        if (!socket || !socket.addEventListener) {
          console.error(
            "Websocket is not available or does not support addEventListener"
          );
          return;
        }
        socket.onmessage = (e) => {
          console.log("WebSocket message received:", e.data);
          const receivedMessage = JSON.parse(e.data);
          if ((receivedMessage.type = "onlineUsers")) {
            setOnlineUsers(receivedMessage.data.map((user) => user.userId));
            setOnlinePeople(receivedMessage.data);
          }
        };
        socket.addEventListener("close", () => {
          setTimeout(() => {
            console.log("Disconnected... Reconnecting");
            connect();
          });
        });
        return () => {
          if (socket && socket.close) {
            socket.close();
          }
        };
      } catch (error) {
        console.error("Error creating WebSocket connection:", error);
      }
    }
  };

  useEffect(() => {
    const fetchSearchSuggestions = async () => {
      try {
        const response = await axios.get(`/user/people?q=${searchQuery}`);
        setSearchSuggestions(response.data);
      } catch (error) {
        console.error("Error Fetching Search Suggestions:", error);
      }
    };
    console.log(searchSuggestions);

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
  };

  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      // Check if the click is outside the search input and suggestion dropdown
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target) &&
        !event.target.closest(".suggestion-dropdown")
      ) {
        setIsSuggestionsOpen(false);
      }
    };

    // Add click event listener to the document
    document.addEventListener("click", handleDocumentClick);

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [searchInputRef]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offlinePeople = await axios.get("/user/people");
        const offlineUsers = offlinePeople.data
          .filter((p) => p._id !== uId)
          .filter((p) => !onlineUsers.includes(p._id));
        setOfflineUserData(offlineUsers);
      } catch (error) {
        console.error("Error fetching offline People:", error);
      }
    };
    fetchData();
  }, [uId, onlineUsers]);

  function selectContact(userId) {
    try {
      setSelectedUserIds(userId);
      setUnreadCounts((prev) => ({
        ...prev,
        [userId]: 0,
      }));
    } catch (error) {
      console.error("Error selecting contact:", error);
    }
  }

  function sendMessage(e) {
    e.preventDefault();
    try {
      ws.send(
        JSON.stringify({
          recipient: selectedUserIds,
          text: newMessageText,
        })
      );
      setNewMessageText("");
      setMessages((prev) => [
        ...prev,
        {
          text: newMessageText,
          sender: uId,
          recipient: selectedUserIds,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  useEffect(() => {
    if (!selectedUserIds) {
      setMessages([]);
    } else {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/user/messages/${selectedUserIds}`);
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching message");
        }
      };
      fetchData();
    }
  }, [selectedUserIds]);

  const formatTimeStamp = (timeStamp) => {
    const date = new Date(timeStamp);
    const hours = date.getHours();
    let minutes = date.getMinutes();
    minutes = isNaN(minutes) ? 0 : minutes;
    const amPM = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedTime = `${formattedHours}:${
      minutes < 10 ? "0" : ""
    }${minutes}${amPM}`;
    return formattedTime;
  };

  useEffect(() => {
    const chatScroll = document.getElementById("chat-Container");
    if (chatScroll) {
      chatScroll.scrollTop = chatScroll.scrollHeight;
    }
  }, [messages]);

  if (loading) {
    return <p>Loading...</p>;
  }

  const selectedUser = selectedUserIds
    ? onlinePeople.find((user) => user.userId === selectedUserIds) ||
      offlineUserData.find((user) => user._id === selectedUserIds)
    : null;

  // const removeUserFromChat = (userId) => {
  //   console.log("Removing User from Chat");
  //   setFetchMessages((prev) => ({
  //     ...prev,
  //     [userId]: messages,
  //   }));
  //   setUserIds((prev) => prev.filter((id) => id !== userId));
  //   const remainingUsers = userIds.filter((id) => id !== userId);
  //   if (remainingUsers.length > 0) {
  //     const nextUserId = remainingUsers[0];
  //     setSelectedUserIds(nextUserId);
  //     if (fetchMessages[nextUserId]) {
  //       setMessages(fetchMessages[nextUserId]);
  //     } else {
  //       const fetchData = async () => {
  //         try {
  //           const response = await axios.get(`/user/messages/${nextUserId}`);
  //           setMessages(response.data);
  //         } catch (error) {
  //           console.error("Error Fetching Message History:", error.message);
  //         }
  //       };
  //       fetchData();
  //     }
  //   } else {
  //     setMessages([]);
  //     setSelectedUserIds(null);
  //   }
  // };

  return (
    <div className="flex w-full h-[100vh] pt-16">
      <div className="bg-blue-100 md:w-2/5 w-2/3 flex flex-col h-full overflow-y-auto">
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
            <div className="absolute top-full left-0 bg-white border rounded-lg mt-1 w-full max-h-40 overflow-y-auto z-10 suggestion-dropdown">
              {searchSuggestions.slice(0, 5).map((user) => (
                <div
                  key={user._id}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelectUserFromSearch(user._id)}
                >
                  {user.firstName}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-2 w-full flex flex-col items-center justify-center">
          <div className="font-bold md:border md:rounded-lg md:border-black w-full p-2 text-left mb-2 bg-transparent">
            <div
              className="flex h-full justify-between items-center cursor-pointer"
              onClick={() => setOnlineCollapsed(!onlineCollapsed)}
            >
              Online Users ({Math.max(0, onlineUsers.length - 1)})
              {/* Ensures the count is never negative. It doesn't go below 0... it subtracts 1 from the length of 'onlineUsers' */}
              {onlineCollapsed ? <FaChevronDown /> : <FaChevronUp />}
            </div>
          </div>
          {!onlineCollapsed && (
            <div className="w-full overflow-y-auto md:border-black md:rounded-lg shadow-md bg-transparent">
              <div className="p-2 text-left h-full overflow-y-auto">
                {onlinePeople
                  .filter((user) => user.userId !== uId)
                  .map((user) => (
                    <div
                      onClick={() => selectContact(user.userId)}
                      key={user._id}
                      className="p-2 hover:bg-gray-100 transition duration-300 flex items-center"
                    >
                      <div>
                        <Avatar
                          online={true}
                          username={user.username}
                          userId={user.userId}
                          unreadCount={unreadCounts[user.userId] || 0}
                        />
                      </div>
                      <h1 className="capitalize">{user.username}</h1>
                      {selectedUserIds === user.userId && (
                        <button
                          className="ml-auto p-2 text-red-500 focus:outline-none"
                          // onClick={() => removeUserFromChat(user.userId)}
                        >
                          x
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="font-bold md:border md:rounded-lg md:border-black w-full p-2 text-left mb-2 bg-transparent">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setOfflineCollapsed(!offlineCollapsed)}
            >
              <h1 className="p-2">Offline Users ({offlineUserData.length})</h1>
              {offlineCollapsed ? <FaChevronDown /> : <FaChevronUp />}
            </div>
          </div>
          {!offlineCollapsed && (
            <div className="w-full overflow-y-auto md:border-black md:rounded-lg shadow-md bg-transparent">
              <div className="p-2 text-left h-[30%] overflow-y-auto">
                {offlineUserData.map((user) => (
                  <div
                    key={user._id}
                    className="p-2 hover:bg-gray-100 transition duration-300 flex items-center"
                    onClick={() => selectContact(user._id)}
                  >
                    <div>
                      <Avatar
                        online={false}
                        username={user.firstName}
                        userId={user._id}
                        unreadCount={unreadCounts[user._id] || 0}
                      />
                    </div>
                    <h1 className="capitalize">{user.firstName}</h1>
                    {selectedUserIds === user._id && (
                      <button
                        className="ml-auto p-2 text-red-500 focus:outline-none"
                        onClick={() => removeUserFromChat(user._id)}
                      >
                        x
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* <div className="p-2 text-center mt-auto">
          <h1 className="capitalize">{user}</h1>
        </div> */}
      </div>
      <div className="md:w-3/5 w-3/5 flex flex-col h-full bg-blue-300">
        {selectedUser && (
          <div className="w-full border-b p-3 border-black rounded-lg">
            <div className="flex items-center">
              <Avatar
                online={onlineUsers.includes(
                  selectedUser._id || selectedUser.userId
                )}
                username={selectedUser?.username || selectedUser?.firstName}
                userId={selectedUser._id || selectedUser.userId}
              />
              <h1 className="font-bold capitalize">
                {selectedUser?.username || selectedUser?.firstName}
              </h1>
            </div>
          </div>
        )}

        {selectedUserIds && (
          <div id="chat-Container" className="flex-grow overflow-y-auto p-4">
            {Array.isArray(messages) && messages.length > 0
              ? messages.map((message, index) => (
                  <div
                    key={index}
                    className={
                      "flex " +
                      (message.sender === uId ? "justify-end" : "justify-start")
                    }
                  >
                    <div
                      className={
                        "max-w-full md:p-4 p-3 py-2 mb-2 rounded-lg " +
                        (message.sender === uId
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-500")
                      }
                    >
                      <h1>{message.text}</h1>
                      <div className="md:text-[1.3vmin] text-[1.6vmin] text-gray-400">
                        {formatTimeStamp(message.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
              : null}
          </div>
        )}
        {selectedUserIds && (
          <div className="p-4 flex items-center rounded-lg w-full relative">
            <input
              type="text"
              value={newMessageText}
              onChange={(ev) => setNewMessageText(ev.target.value)}
              placeholder="Type Your Message Here"
              className="flex-grow p-2 border rounded-lg focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 p-2 border rounded-lg text-white"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
