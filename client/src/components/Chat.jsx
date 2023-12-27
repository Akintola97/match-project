import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { useAuth } from "../AuthContext";
import axios from "axios";

const Chat = () => {
  const [onlinePeople, setOnlinePeople] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const { uId } = useAuth();
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);

  // useEffect(() => {
  //   const socket = new WebSocket("ws://localhost:5000/user");
  //   setWs(socket);
  //   socket.addEventListener("message", handleMessage);

  //   return () => {
  //     // Cleanup WebSocket connection when component unmounts
  //     socket.close();
  //   };
  // }, []);

  useEffect(() => {
    
    try {
      const socket = new WebSocket("ws://localhost:5000/user");
      setWs(socket);
  
      // Check if the socket supports the necessary methods
      if (!socket || !socket.addEventListener) {
        console.error("WebSocket is not available or does not support addEventListener.");
        return;
      }
  
      socket.addEventListener("message", handleMessage);
      socket.addEventListener('close', () => console.log('closed'))
  
      return () => {
        // Cleanup WebSocket connection when component unmounts
        if (socket && socket.close) {
          socket.close();
        } 
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
    }
  }, []);
  

  // function handleMessage(e) {
  //   const messageData = JSON.parse(e.data);
  //   console.log({ e, messageData });
  //   if (messageData.type === "onlineUsers") {
  //     const filteredUsers = messageData.data.filter(
  //       (user) => !uId.includes(user.userId)
  //     );
  //     const userIds = filteredUsers.map((user) => user.userId);

  //     setUserIds(userIds);
  //     setOnlinePeople(filteredUsers);
  //   } else if ("text" in messageData) {
  //     setMessages((prev) => [...prev, { ...messageData }]);
  //   }
  // }
  function handleMessage(e) {
    try {
      const messageData = JSON.parse(e.data);
  
      if (!messageData) {
        console.error("Invalid message data received:", e.data);
        return;
      }
  
      console.log({ e, messageData });
  
      if (messageData.type === "onlineUsers") {
        if (!messageData.data || !Array.isArray(messageData.data)) {
          console.error("Invalid onlineUsers data received:", messageData.data);
          return;
        }
  
        const filteredUsers = messageData.data.filter(
          (user) => !uId.includes(user.userId)
        );
        const userIds = filteredUsers.map((user) => user.userId);
  
        setUserIds(userIds);
        setOnlinePeople(filteredUsers);
      } else if ("text" in messageData) {
        if (!messageData.text || typeof messageData.text !== "string") {
          console.error("Invalid text data received:", messageData.text);
          return;
        }
  
        setMessages((prev) => [...prev, { ...messageData }]);
      } else {
        console.error("Unknown message type:", messageData.type);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  }
  

  // function selectContact(userId) {
  //   setSelectedUserId(userId);
  // }
  function selectContact(userId) {
    try {
      // Check if userId is a truthy value
      if (!userId) {
        console.error("Invalid userId:", userId);
        return;
      }
  
      // Perform the selection logic
      setSelectedUserId(userId);
    } catch (error) {
      console.error("Error selecting contact:", error);
    }
  }
  

  // function sendMessage(e) {
  //   e.preventDefault();
  //   ws.send(
  //     JSON.stringify({
  //       reciepient: selectedUserId,
  //       text: newMessageText,
  //     })
  //   );
  //   setNewMessageText("");
  //   setMessages((prev) => [
  //     ...prev,
  //     { text: newMessageText, sender: uId, reciepient: selectedUserId },
  //   ]);
  // }

  function sendMessage(e) {
    try {
      e.preventDefault();
  
      // Check if selectedUserId is valid
      if (!selectedUserId) {
        console.error("Invalid selectedUserId:", selectedUserId);
        return;
      }
  
      // Check if newMessageText is a non-empty string
      if (typeof newMessageText !== "string" || newMessageText.trim() === "") {
        console.error("Invalid newMessageText:", newMessageText);
        return;
      }
  
      ws.send(
        JSON.stringify({
          recipient: selectedUserId, // Corrected spelling to match schema
          text: newMessageText,
        })
      );
  
      setNewMessageText("");
      setMessages((prev) => [
        ...prev,
        { text: newMessageText, sender: uId, recipient: selectedUserId }, // Corrected spelling to match schema
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
  

  useEffect(() => {
    const fetchData = async () => {
      if (selectedUserId) {
        console.log(selectedUserId)
        try {
          const response = await axios.get(`/user/messages/${selectedUserId}`);
          console.log(response.data);
          // Process or set state based on the response data
        } catch (error) {
          console.error("Error fetching message history:", error.message);
          // Handle errors, e.g., set an error state
        }
      }
    };
  
    fetchData(); // Call fetchData here, not outside the function
  
  }, [selectedUserId]);
  
  
  return (
    <div className="flex min-h-screen pt-16">
      <div className="bg-blue-100 w-1/4">
        {userIds.map((id) => (
          <div
            key={id}
            onClick={() => selectContact(id)}
            className={
              "border-b border-gray-100 py-2 pl-4 flex items-center gap-2" +
              (id === selectedUserId ? " bg-blue-200 rounded-lg w-full" : "")
            }
          >
            <div>
              <Avatar
                username={
                  onlinePeople.find((user) => user.userId === id).username
                }
                userId={id}
              />
            </div>
            <h1 className="capitalize">
              {onlinePeople.find((user) => user.userId === id).username}
            </h1>
          </div>
        ))}
      </div>
      <div className="flex flex-col bg-blue-300 w-3/4 p-2 flex-grow-reverse">
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
                      "max-w-xs py-2 px-4 mb-2 rounded-lg " +
                      (message.sender === uId
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-500")
                    }
                  >
                    {/* {message.sender !== uId && <p className="text-sm mb-1">{message.sender}</p>} */}
                    {message.sender === uId ? "ME:" : ""}{" "}
                    <h1>{message.text}</h1>
                    {/* <p>{message.text}</p> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {selectedUserId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              type="text"
              value={newMessageText}
              onChange={(ev) => setNewMessageText(ev.target.value)}
              placeholder="Type your message here"
              className="bg-white flex-grow border rounded-lg p-2"
            />
            <button
              type="submit"
              className="bg-blue-500 p-2 border rounded-md text-white"
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
