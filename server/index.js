const express = require("express");
const app = express();
require("dotenv").config();
const hostname = "localhost";
const port = 10001;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const mongo_db = process.env.MONGODB;
const ws = require("ws");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const User = require("./Model/User");
const Message = require("./Model/Message");
const path = require('path');




const route = require("./Views/route");
const sport_route = require("./Views/sports");
const admin_Route = require("./Views/inventoryRoute");



const allowedOrigins = ["https://sports.boltluna.io", 'http:localhost:3000']; // Add more origins as needed

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/user", route);
app.use("/admin", admin_Route);
app.use("/sport", sport_route);



mongoose
  .connect(mongo_db)
  .then(() => {
    console.log("The Db is connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(express.static(path.join(__dirname, "..", "client", "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});

const server = app.listen(port, hostname, () => {
  console.log(`The app is running on ${hostname}${port}`);
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

          onlineUsers.add(userId);
          userMap.set(userId, { userId, username: firstName });
          broadcastOnlineUsers();
        }
      } catch (error) {
        console.error("Token not found:", error);
        connection.close();
      }
    }
  }

  connection.send(
    JSON.stringify({
      type: "onlineUsers",
      data: Array.from(onlineUsers).map((userId) => userMap.get(userId)),
    })
  );

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text } = messageData;

    if (recipient && text) {
      const newMessage = new Message({
        sender: connection.userId,
        recipient,
        text,
      });
      await newMessage.save();

      wss.clients.forEach((client) => {
        if (client.userId === recipient && client.readyState === ws.OPEN) {
          client.send(
            JSON.stringify({
              type: "text",
              text,
              recipient,
              sender: connection.userId,
              id: newMessage._id,
              createdAt: newMessage.createdAt,
            })
          );
        }
      });
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
