import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useAuth } from "../AuthContext";

const Chat = () => {
  const { user, uId } = useAuth(); // Assuming uId is the userId of the current user
  const { selectedUser } = useParams();
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    // Initialize WebSocket connection
    const newSocket = new WebSocket("ws://localhost:5000/user");

    newSocket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    newSocket.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      const receivedMessage = JSON.parse(event.data);

      if (receivedMessage.type === "onlineUsers") {
        const onlineUsersArray = receivedMessage.data;
        setOnlineUsers(onlineUsersArray);
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setSocket(newSocket);

    // Cleanup function to close WebSocket connection when component unmounts
    return () => {
      newSocket.close();
    };
  }, []); // Empty dependency array ensures that this effect runs only once on mount

  const handleSendMessage = () => {
    // Placeholder code for sending a message
    if (socket && messageInput.trim() !== "") {
      const messageData = {
        type: "message",
        data: {
          content: messageInput,
          to: selectedUser,
        },
      };

      socket.send(JSON.stringify(messageData));
      setMessageInput(""); // Clear the message input field
    }
  };

  // Ensure that the current user is excluded from the online users array
  const filteredOnlineUsers = onlineUsers.filter((onlineUser) => onlineUser.userId !== uId);

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar - Online Users */}
      <div className="bg-blue-100 w-1/4 p-4 pt-16">
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Online Users</h2>
          <ul>
            {/* Render filtered online users */}
            {filteredOnlineUsers.map((onlineUser) => (
              <li key={onlineUser.userId}>{onlineUser.username}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Chat Area - Message History */}
      <div className="flex flex-col bg-gray-100 w-3/4 p-4 pt-20">
        {/* Message History */}
        <div className="flex-grow overflow-y-auto mt-4">
          {/* Display chat history here */}
          {chatHistory.map((message, index) => (
            <div key={index}>{message.content}</div>
          ))}
        </div>
        <div className="mt-4">
          <form className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-grow border rounded p-2 focus:outline-none"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button
              type="button"
              onClick={handleSendMessage}
              className="bg-blue-500 p-2 text-white rounded"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
