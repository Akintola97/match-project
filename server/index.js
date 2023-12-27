const express = require("express");
const app = express();
require("dotenv").config();
const hostname = "localhost";
const port = 5000;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const mongo_db = process.env.MONGODB;
const route = require("./Views/route");
const sport_route = require("./Views/sports");
const ws = require("ws");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const User = require("./Model/User");
const Message = require("./Model/Message");

app.use(cors({credentials: true, origin:"http://localhost:3000"}));
app.use(express.json());
app.use(cookieParser());

app.use("/user", route);
app.use("/sport", sport_route);

mongoose
  .connect(mongo_db)
  .then(() => {
    console.log("The Db is connected");
  })
  .catch((error) => {
    console.log(error);
  });

const server = app.listen(port, hostname, () => {
  console.log(`The app is running on ${hostname} ${port}`);
});

const wss = new ws.Server({ server });
const onlineUsers = new Set();
const userMap = new Map();

wss.on("connection", async (connection, req) => {
  const cookies = req.headers.cookie;

  if (cookies) {
    const authTokenMatch = cookies.match(/authToken=([^;]*)/);
    const authToken = authTokenMatch ? authTokenMatch[1] : null;

    if (authToken) {
      try {
        const decodedToken = jwt.verify(authToken, secret);
        const userId = decodedToken.userId;

        const user = await User.findById(userId);

        if (user) {
          const { firstName } = user;

          connection.userId = userId;
          connection.username = firstName;

          // Add user to the Set of online users
          onlineUsers.add(userId);

          // Add user to the Map with their userId as the key
          userMap.set(userId, { userId, username: firstName });

          // Broadcast updated online users to all connected clients
          broadcastOnlineUsers();
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        connection.close();
      }
    }
  }

  // Notify the current client about online users
  connection.send(
    JSON.stringify({
      type: "onlineUsers",
      data: Array.from(onlineUsers).map((userId) => userMap.get(userId)),
    })
  );

  connection.on("message", (message) => {
    const messageData = JSON.parse(message.toString());
    const { reciepient, text, type } = messageData;

    // if (type === "message" && recipient && text) {
    //   const recipientConnections = Array.from(wss.clients).filter(c => c.userId === recipient);
    //   recipientConnections.forEach(c => c.send(JSON.stringify({ text })));
    if (reciepient && text) {
      const newMessage = new Message({
        sender: connection.userId,
        reciepient,
        text,
      });

      newMessage.save();

      [...wss.clients]
        .filter((c) => c.userId === reciepient)
        .forEach((c) =>
          c.send(JSON.stringify({ 
            text, 
            reciepient,
            sender: connection.userId,
            id: newMessage._id,
          
          }))
        );
    }
  });

  connection.on("close", () => {
    // Remove user from the Set of online users
    onlineUsers.delete(connection.userId);

    // Remove user from the Map
    userMap.delete(connection.userId);

    // Broadcast updated online users to all connected clients
    broadcastOnlineUsers();
  });
});

function broadcastOnlineUsers() {
  wss.clients.forEach((client) => {
    if (client.readyState === ws.OPEN) {
      client.send(
        JSON.stringify({
          type: "onlineUsers",
          data: Array.from(onlineUsers).map((userId) => userMap.get(userId)),
        })
      );
    }
  });
}
