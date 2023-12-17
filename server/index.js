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
const { userInfo } = require("./Controller/authController");
const secret = process.env.SECRET;
const User = require("./Model/User");
const Message = require("./Model/Message");

app.use(cors());
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

//  app.listen(port, hostname, () => {
//   console.log(`The app is running on ${hostname} ${port}`);
// });

const server = app.listen(port, hostname, () => {
  console.log(`The app is running on ${hostname} ${port}`);
});

const wss = new ws.Server({ server });
const onlineUsers = new Set();

// wss.on('connection', async (connection, req) => {
//   const cookies = req.headers.cookie;

//   if (cookies) {
//     const authTokenMatch = cookies.match(/authToken=([^;]*)/);
//     const authToken = authTokenMatch ? authTokenMatch[1] : null;

//     if (authToken) {
//       try {
//         const decodedToken = jwt.verify(authToken, secret);
//         const userId = decodedToken.userId;

//         const user = await User.findById(userId);

//         if (user) {
//           const { firstName } = user;

//           connection.userId = userId;
//           connection.username = firstName;

//           onlineUsers.add(userId);

//           broadcastOnlineUsers();

//         }
//       } catch (error) {
//         console.error('Error decoding token:', error);
//         connection.close();
//       }
//     }
//   }
//   connection.on('close', ()=>{
//     if(connection.userId){
//       onlineUsers.delete(connection.userId);
//       broadcastOnlineUsers();
//     }
//   })
// });

// function broadcastOnlineUsers(){
//   const onlineUsersArray = Array.from(onlineUsers);
//   wss.clients.forEach((client)=>{
//     if(client.readyState === ws.OPEN){
//       client.send(JSON.stringify({
//         type: "onlineUsers",
//         data: onlineUsersArray
//       }))
//     }
//   })
// }

// Define broadcastOnlineUsers outside the connection event handler
function broadcastOnlineUsers() {
  const onlineUsersArray = Array.from(onlineUsers);
  wss.clients.forEach((client) => {
    if (client.readyState === ws.OPEN) {
      client.send(
        JSON.stringify({
          type: "onlineUsers",
          data: onlineUsersArray,
        })
      );
    }
  });
}

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
          broadcastOnlineUsers();
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        connection.close();
      }
    }
  }

  connection.on("close", () => {
    if (connection.userId) {
      onlineUsers.delete(connection.userId);
      broadcastOnlineUsers();
    }
  });
});
