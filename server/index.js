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
const Message = require('./Model/Message');

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

const server = app.listen(port, hostname, () => {
  console.log(`The app is running on ${hostname} ${port}`);
});

// const wss = new ws.Server({ server });
// const onlineUsers = new Set();

// // Define broadcastOnlineUsers outside the connection event handler
// function broadcastOnlineUsers() {
//   const onlineUsersArray = Array.from(onlineUsers);
//   wss.clients.forEach((client) => {
//     if (client.readyState === ws.OPEN) {
//       client.send(
//         JSON.stringify({
//           type: "onlineUsers",
//           data: onlineUsersArray,
//         })
//       );
//     }
//   });
// }

// wss.on("connection", async (connection, req) => {
//   let selectedUser;
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

//           // Retrieve and send chat history from the database
//           const chatHistory = await Message.find({
//             $or: [
//               { from: userId },
//               { to: userId },
//             ],
//           })
//             .sort({ timestamp: 1 })
//             .select(["from", "to", "content"]);

//           const chatHistoryData = chatHistory.map((msg) => ({
//             from: msg.from.toString(),
//             to: msg.to.toString(),
//             content: msg.content,
//           }));

//           connection.send(
//             JSON.stringify({
//               type: "chatHistory",
//               data: chatHistoryData,
//             })
//           );

//           connection.on("message", async (message) => {
//             try {
//               const parsedMessage = JSON.parse(message);
//               const { content, to: recipientUserId } = parsedMessage.data;

//               selectedUser = recipientUserId;

//               const newMessage = new Message({
//                 from: connection.userId,
//                 to: selectedUser,
//                 content: content,
//               });
//               await newMessage.save();

//               sendMessagetoClient({
//                 from: connection.userId,
//                 to: selectedUser,
//                 content: content,
//               });
//             } catch (error) {
//               console.error("Error saving message:", error);
//             }
//           });
//         }
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         connection.close();
//       }
//     }
//   }

//   connection.on("close", () => {
//     if (connection.userId) {
//       onlineUsers.delete(connection.userId);
//       broadcastOnlineUsers();
//     }
//   });
// });

// // Function to send messages to clients
// function sendMessagetoClient(data) {
//   wss.clients.forEach((client) => {
//     if (client.readyState === ws.OPEN) {
//       client.send(
//         JSON.stringify({
//           type: "message",
//           data,
//         })
//       );
//     }
//   });
// }

// // Function to send online users information to clients
// function sendOnlineUsers() {
//   const onlineUsersArray = Array.from(wss.clients).map(client => ({
//     userId: client.userId,
//     username: client.username,
//   }));

//   wss.clients.forEach((client) => {
//     if (client.readyState === ws.OPEN) {
//       client.send(
//         JSON.stringify({
//           type: "onlineUsers",
//           data: onlineUsersArray,
//         })
//       );
//     }
//   });
// }



const wss = new ws.Server({ server });

// wss.on("connection", async (connection, req) => {
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

//           sendOnlineUsers();

//           // Retrieve and send chat history from the database
//           const chatHistory = await Message.find({
//             $or: [
//               { from: userId },
//               { to: userId },
//             ],
//           })
//             .sort({ timestamp: 1 })
//             .select(["from", "to", "content"]);

//           const chatHistoryData = chatHistory.map((msg) => ({
//             from: msg.from.toString(),
//             to: msg.to.toString(),
//             content: msg.content,
//           }));

//           connection.send(
//             JSON.stringify({
//               type: "chatHistory",
//               data: chatHistoryData,
//             })
//           );

//           connection.on("message", async (message) => {
//             try {
//               const parsedMessage = JSON.parse(message);
//               const { content, to: recipientUserId } = parsedMessage.data;

//               const newMessage = new Message({
//                 from: connection.userId,
//                 to: recipientUserId,
//                 content: content,
//               });

//               await newMessage.save();
//               sendMessagetoClient({
//                 from: connection.userId,
//                 to: recipientUserId,
//                 content: content,
//               });
//             } catch (error) {
//               console.error("Error saving message:", error);
//             }
//           });
//         }
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         connection.close();
//       }
//     }
//   }

//   connection.on("close", () => {
//     if (connection.userId) {
//       sendOnlineUsers();
//     }
//   });

//   connection.on('message', async (message) => {
//     const messageData = JSON.parse(message.toString());
//     const { recipient, text } = messageData;
//     if (recipient && text) {
//       const messages = new Message({
//         sender: connection.userId,
//         recipient,
//         text
//       });

//       [...wss.clients].filter(c => c.userId === recipient)
//         .forEach(c => c.send(JSON.stringify({
//           text,
//           sender: connection.userId,
//           recipient,
//         })))
//     }
//   });
// });

// // Function to send messages to clients
// function sendMessagetoClient(data) {
//   wss.clients.forEach((client) => {
//     if (client.readyState === ws.OPEN) {
//       client.send(
//         JSON.stringify({
//           type: "message",
//           data,
//         })
//       );
//     }
//   });
// }

// // Function to send online users information to clients
// function sendOnlineUsers() {
//   const onlineUsersArray = Array.from(wss.clients).map(client => ({
//     userId: client.userId,
//     username: client.username,
//   }));

//   wss.clients.forEach((client) => {
//     if (client.readyState === ws.OPEN) {
//       client.send(
//         JSON.stringify({
//           type: "onlineUsers",
//           data: onlineUsersArray,
//         })
//       );
//     }
//   });
// }

const onlineUsers = new Set();

// Define broadcastOnlineUsers outside the connection event handler
// function broadcastOnlineUsers() {
//   const onlineUsersArray = Array.from(onlineUsers);

function getUsernameById(userId) {
  const client = Array.from(wss.clients).find(client => client.userId === userId);
  return client ? client.username : null;
}





function broadcastOnlineUsers() {
  const onlineUsersArray = Array.from(onlineUsers).map(userId => ({
    userId,
    username: getUsernameById(userId),
  }));

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
  let selectedUser;
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

          // Retrieve and send chat history from the database
          const chatHistory = await Message.find({
            $or: [
              { from: userId },
              { to: userId },
            ],
          })
            .sort({ timestamp: 1 })
            .select(["from", "to", "content"]);

          const chatHistoryData = chatHistory.map((msg) => ({
            from: msg.from.toString(),
            to: msg.to.toString(),
            content: msg.content,
          }));

          connection.send(
            JSON.stringify({
              type: "chatHistory",
              data: chatHistoryData,
            })
          );

          connection.on("message", async (message) => {
            try {
              const parsedMessage = JSON.parse(message);
              const { content, to: recipientUserId } = parsedMessage.data;

              selectedUser = recipientUserId;

              const newMessage = new Message({
                from: connection.userId,
                to: selectedUser,
                content: content,
              });
              await newMessage.save();

              sendMessagetoClient({
                from: connection.userId,
                to: selectedUser,
                content: content,
              });
            } catch (error) {
              console.error("Error saving message:", error);
            }
          });
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

// Function to send messages to clients
function sendMessagetoClient(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === ws.OPEN) {
      client.send(
        JSON.stringify({
          type: "message",
          data,
        })
      );
    }
  });
}