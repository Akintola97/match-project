import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { useAuth } from "../AuthContext";

const Chat = () => {
  const [onlinePeople, setOnlinePeople] = useState([]);
  const [userId, setUserId] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const {uId} = useAuth();

  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000/user");
    setWs(socket);
    socket.addEventListener("message", handleMessage);
  }, []);


function handleMessage(e) {
  const messageData = JSON.parse(e.data);
  if (messageData.type === "onlineUsers") {
    const filteredUsers = messageData.data.filter((user) => user.userId !== uId);
    const usernames = filteredUsers.map((user) => user.username);
    const userIds = filteredUsers.map((user) => user.userId);

    setUserId(userIds);
    setOnlinePeople(usernames);
  }
}

  function selectContact(userId) {
    setSelectedUserId(userId);
  }

  return (
    <div className="flex min-h-screen pt-16">
      <div className="bg-blue-100 w-1/3">
        <div key={userId}
          onClick={() => selectContact(userId)}
          className={
            "border-b border-gray-100 py-2 pl-4 flex items-center gap-2" +
            (userId === selectedUserId ? " bg-blue-200 rounded-lg w-full" : "")
          }
        >
          <div>
            <Avatar username={onlinePeople} userId={userId} />
          </div>
          <h1 className="capitalize">{onlinePeople}</h1>
        </div>
      </div>
      <div className="flex flex-col bg-blue-300 w-2/3 p-2">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="h-full flex items-center justify-center">
             <h1> No selected person </h1>
              </div>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message here"
            className="bg-white flex-grow border rounded-lg p-2"
          />
          <button className="bg-blue-500 p-2 border rounded-md text-white">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
export default Chat;
