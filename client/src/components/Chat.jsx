import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";
import axios from "axios";

const Chat = () => {
  const [onlinePeople, setOnlinePeople] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [offlineUserData, setOfflineUserData] = useState([{}]);
  const [uId, setUid] = useState("");
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({}); // Step 1: Unread message counts

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/user/userinfo");
        setUid(response.data.userId);
        setUser(response.data.firstName);
        setLoading(false); // Set loading to false once uId is available
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    connect();
  }, [uId]);

  const connect = () => {
    if (uId) {
      try {
        const socket = new WebSocket("ws://localhost:5000/user");
        setWs(socket);

        // Check if the socket supports the necessary methods
        if (!socket || !socket.addEventListener) {
          console.error(
            "WebSocket is not available or does not support addEventListener."
          );
          return;
        }

        socket.addEventListener("message", handleMessage);
        socket.addEventListener("close", () => {
          setTimeout(() => {
            console.log("Disconnected... Reconnecting");
            connect();
          });
        });

        return () => {
          // Cleanup WebSocket connection when component unmounts
          if (socket && socket.close) {
            socket.close();
          }
        };
      } catch (error) {
        console.error("Error creating WebSocket connection:", error);
      }
    }
  };

  function handleMessage(e) {
    try {
      const messageData = JSON.parse(e.data);

      if (!messageData) {
        console.error("Invalid message data received:", e.data);
        return;
      }

      if (messageData.type === "onlineUsers") {
        if (!messageData.data || !Array.isArray(messageData.data)) {
          console.error(
            "Invalid onlineUsers data received:",
            messageData.data
          );
          return;
        }

        const filteredUsers = messageData.data.filter(
          (user) => user.userId !== uId
        );
        const userIds = filteredUsers.map((user) => user.userId);

        setUserIds(userIds);
        setOnlinePeople(filteredUsers);
      } else if ("text" in messageData) {
        if (!messageData.text || typeof messageData.text !== "string") {
          console.error("Invalid text data received:", messageData.text);
          return;
        }

        if (messageData.sender !== uId) {
          setMessages((prev) => [...prev, { ...messageData }]);
          // Step 2: Increment the unread count for the sender
          setUnreadCounts((prev) => ({
            ...prev,
            [messageData.sender]: (prev[messageData.sender] || 0) + 1,
          }));
        }
      } else {
        console.error("Unknown message type:", messageData.type);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  }

  function selectContact(userId) {
    try {
      if (!userId) {
        console.error("Invalid userId:", userId);
        return;
      }

      setSelectedUserId(userId);
      // Step 3: Clear the unread count when a user is selected
      setUnreadCounts((prev) => ({ ...prev, [userId]: 0 }));
    } catch (error) {
      console.error("Error selecting contact:", error);
    }
  }

  function sendMessage(e) {
    e.preventDefault();
    try {
      ws.send(
        JSON.stringify({
          reciepient: selectedUserId,
          text: newMessageText,
        })
      );
      setNewMessageText("");
      setMessages((prev) => [
        ...prev,
        {
          text: newMessageText,
          sender: uId,
          reciepient: selectedUserId,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (selectedUserId) {
        try {
          const response = await axios.get(`/user/messages/${selectedUserId}`);
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching message history:", error.message);
        }
      }
    };

    fetchData();
  }, [selectedUserId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offlinePeople = await axios.get("/user/people");
        const offlineUsers = offlinePeople.data
          .filter((p) => p._id !== uId)
          .filter((p) => !userIds.includes(p._id));

        setOfflineUserData(offlineUsers);
      } catch (error) {
        console.error("Error fetching offline people:", error);
      }
    };

    fetchData();
  }, [userIds, uId]);

  // const formatTimestamp = (timestamp) => {
  //   const date = new Date(timestamp);
  //   const hours = date.getHours();
  //   let minutes = date.getMinutes();

  //   minutes = isNaN(minutes) ? 0 : minutes;

  //   const amPM = hours >= 12 ? "PM" : "AM";
  //   const formattedHours = hours % 12 || 12;
  //   const formattedTime = `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${amPM}`;
  //   return formattedTime;
  // };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    let minutes = date.getMinutes();
  
    minutes = isNaN(minutes) ? 0 : minutes;
  
    const amPM = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedTime = `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${amPM}`;
  
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  
    return `${formattedDate} ${formattedTime}`;
  };
  
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex w-full h-screen pt-16">
      <div className="bg-blue-100 md:w-1/4 w-1/3 flex flex-col overflow-y-auto">
        {/* User List */}
        {onlinePeople.map((user) => (
          <div
            key={user.userId}
            onClick={() => selectContact(user.userId)}
            className={
              "border-b border-gray-100 py-2 pl-4 flex items-center gap-2" +
              (user.userId === selectedUserId
                ? " bg-blue-200 rounded-lg w-full"
                : "")
            }
          >
            <div>
              {/* Step 4: Pass the unread count to the Avatar component */}
              <Avatar
                online={true}
                username={user.username}
                userId={user.userId}
                unreadCount={unreadCounts[user.userId] || 0}
              />
            </div>
            <h1 className="capitalize">{user.username}</h1>
          </div>
        ))}

        {offlineUserData.map((user) => (
          <div
            key={user._id}
            onClick={() => selectContact(user._id)}
            className={
              "border-b border-gray-100 py-2 pl-4 flex items-center gap-2" +
              (user._id === selectedUserId
                ? " bg-blue-200 rounded-lg w-full"
                : "")
            }
          >
            <div>
              {/* Step 4: Pass the unread count to the Avatar component */}
              <Avatar
                online={false}
                username={user.firstName}
                userId={user._id}
                unreadCount={unreadCounts[user._id] || 0}
              />
            </div>
            <h1 className="capitalize">{user.firstName}</h1>
          </div>
        ))}
        <div className="p-2 text-center mt-auto">
          <h1 className="capitalize">{user}</h1>
        </div>
      </div>

      <div className="flex flex-col bg-blue-300 md:w-3/4 w-2/3 p-2 overflow-y-auto flex-grow-reverse">
        {/* Chat History */}
        <div className="flex-grow overflow-y-auto">
          {selectedUserId && (
            <div>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    "flex " +
                    (message.sender === uId ? "justify-end" : "justify-start")
                  }
                >
                  <div
                    className={
                      "max-w-xs py-2 px-2 mb-2 rounded-lg " +
                      (message.sender === uId
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-500")
                    }
                  >
                    <h1>{message.text}</h1>
                    <div className="md:text-[1.3vmin] text-[1.6vmin]  text-gray-400">
                      {formatTimestamp(message.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Input */}
        {selectedUserId && (
          <form className="flex w-full gap-2" onSubmit={sendMessage}>
            <input
              type="text"
              value={newMessageText}
              onChange={(ev) => setNewMessageText(ev.target.value)}
              placeholder="Type your message here"
              className="bg-white flex-grow border rounded-lg md:mt-10 mt-8 md:p-2"
            />
            <button
              type="submit"
              className="bg-blue-500 md:mt-10 mt-8 md:p-2 border rounded-md text-white"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
