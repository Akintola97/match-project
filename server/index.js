// // const express = require("express");
// // const app = express();
// // require("dotenv").config();
// // const hostname = "localhost";
// // const port = 5000;
// // const cors = require("cors");
// // const cookieParser = require("cookie-parser");
// // const mongoose = require("mongoose");
// // const mongo_db = process.env.MONGODB;
// // const route = require("./Views/route");
// // const sport_route = require("./Views/sports");
// // const ws = require("ws");
// // const jwt = require("jsonwebtoken");
// // const secret = process.env.SECRET;
// // const User = require("./Model/User");
// // const Message = require('./Model/Message');

// // app.use(cors());
// // app.use(express.json());
// // app.use(cookieParser());

// // app.use("/user", route);
// // app.use("/sport", sport_route);

// // mongoose
// //   .connect(mongo_db)
// //   .then(() => {
// //     console.log("The Db is connected");
// //   })
// //   .catch((error) => {
// //     console.log(error);
// //   });

// // const server = app.listen(port, hostname, () => {
// //   console.log(`The app is running on ${hostname} ${port}`);
// // });

// // const wss = new ws.Server({ server });
// // const onlineUsers = new Set();

// // function getUsernameById(userId) {
// //   const client = Array.from(wss.clients).find(client => client.userId === userId);
// //   return client ? client.username : null;
// // }

// // // Function to broadcast online users to all clients
// // function broadcastOnlineUsers() {
// //   const onlineUsersArray = Array.from(onlineUsers).map(userId => ({
// //     userId,
// //     username: getUsernameById(userId),
// //   }));

// //   wss.clients.forEach(client => {
// //     if (client.readyState === ws.OPEN) {
// //       const filteredOnlineUsers = onlineUsersArray.filter(user => user.userId !== client.userId);
// //       client.send(
// //         JSON.stringify({
// //           type: "onlineUsers",
// //           data: filteredOnlineUsers,
// //         })
// //       );
// //     }
// //   });
// // }

// // let selectedUser;
// // wss.on("connection", async (connection, req) => {
  
// //   const cookies = req.headers.cookie;

// //   if (cookies) {
// //     const authTokenMatch = cookies.match(/authToken=([^;]*)/);
// //     const authToken = authTokenMatch ? authTokenMatch[1] : null;

// //     if (authToken) {
// //       try {
// //         const decodedToken = jwt.verify(authToken, secret);
// //         const userId = decodedToken.userId;

// //         const user = await User.findById(userId);

// //         if (user) {
// //           const { firstName } = user;

// //           connection.userId = userId;
// //           connection.username = firstName;

// //           onlineUsers.add(userId);
// //           broadcastOnlineUsers();

// //           // Retrieve and send chat history from the database
// //           const chatHistory = await Message.find({
// //             $or: [
// //               { from: userId },
// //               { to: userId },
// //             ],
// //           })
// //             .sort({ timestamp: 1 })
// //             .select(["from", "to", "content"]);

// //           const chatHistoryData = chatHistory.map((msg) => ({
// //             from: msg.from ? msg.from.toString() : '',
// //             to: msg.to ? msg.to.toString() : '',
// //             content: msg.content,
// //           }));
          
          

// //           connection.send(
// //             JSON.stringify({
// //               type: "chatHistory",
// //               data: chatHistoryData,
// //             })
// //           );

// //           connection.on("message", async (message) => {
// //             try {
// //               const parsedMessage = JSON.parse(message);
// //               const { content, to: recipientUserId } = parsedMessage.data;

// //               selectedUser = recipientUserId;

// //               const newMessage = new Message({
// //                 from: connection.userId,
// //                 to: selectedUser,
// //                 content: content,
// //               });
// //               await newMessage.save();

// //               sendMessagetoClient({
// //                 from: connection.userId,
// //                 to: selectedUser,
// //                 content: content,
// //               });

// //               const recipientConnection = Array.from(wss.clients).find(
// //                 (client) => client.userId === selectedUser
// //               );

// //               if (recipientConnection) {
// //                 // Retrieve and send chat history to the sender and recipient only
// //                 const chatHistory = await Message.find({
// //                   $or: [
// //                     { from: connection.userId, to: selectedUser },
// //                     { from: selectedUser, to: connection.userId },
// //                   ],
// //                 })
// //                   .sort({ timestamp: 1 })
// //                   .select(["from", "to", "content"]);

// //                 const chatHistoryData = chatHistory.map((msg) => ({
// //                   from: msg.from.toString(),
// //                   to: msg.to.toString(),
// //                   content: msg.content,
// //                 }));

// //                 connection.send(
// //                   JSON.stringify({
// //                     type: "chatHistory",
// //                     data: chatHistoryData,
// //                   })
// //                 );

// //                 recipientConnection.send(
// //                   JSON.stringify({
// //                     type: "chatHistory",
// //                     data: chatHistoryData,
// //                   })
// //                 );
// //               }
// //             } catch (error) {
// //               console.error("Error saving message:", error);
// //             }
// //           });
// //         }
// //       } catch (error) {
// //         console.error("Error decoding token:", error);
// //         connection.close();
// //       }
// //     }
// //   }

// //   connection.on("close", () => {
// //     if (connection.userId) {
// //       onlineUsers.delete(connection.userId);
// //       broadcastOnlineUsers(); // Move the function call here
// //     }
// //   });
// // });

// // // Inside the "sendMessagetoClient" function
// // function sendMessagetoClient(data) {
// //   wss.clients.forEach((client) => {
// //     if (client.readyState === ws.OPEN) {
// //       client.send(
// //         JSON.stringify({
// //           type: "message",
// //           data: {
// //             ...data,
// //             to: selectedUser, // Include the 'to' field
// //             username: getUsernameById(data.from),
// //           },
// //         })
// //       );
// //     }
// //   });
// // }

// const express = require("express");
// const app = express();
// require("dotenv").config();
// const hostname = "localhost";
// const port = 5000;
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const mongoose = require("mongoose");
// const mongo_db = process.env.MONGODB;
// const route = require("./Views/route");
// const sport_route = require("./Views/sports");
// const ws = require("ws");
// const jwt = require("jsonwebtoken");
// const secret = process.env.SECRET;
// const User = require("./Model/User");
// const Message = require('./Model/Message');

// app.use(cors());
// app.use(express.json());
// app.use(cookieParser());

// app.use("/user", route);
// app.use("/sport", sport_route);

// mongoose
//   .connect(mongo_db)
//   .then(() => {
//     console.log("The Db is connected");
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// const server = app.listen(port, hostname, () => {
//   console.log(`The app is running on ${hostname} ${port}`);
// });

// const wss = new ws.Server({ server });
// const onlineUsers = new Set();

// // function getUsernameById(userId) {
// //   const client = Array.from(wss.clients).find(client => client.userId === userId);
// //   return client ? client.username : null;
// // }

// // // Function to broadcast online users to all clients
// // function broadcastOnlineUsers() {
// //   const onlineUsersArray = Array.from(onlineUsers).map(userId => ({
// //     userId,
// //     username: getUsernameById(userId),
// //   }));

// //   wss.clients.forEach(client => {
// //     if (client.readyState === ws.OPEN) {
// //       const filteredOnlineUsers = onlineUsersArray.filter(user => user.userId !== client.userId);
// //       client.send(
// //         JSON.stringify({
// //           type: "onlineUsers",
// //           data: filteredOnlineUsers,
// //         })
// //       );
// //     }
// //   });
// // }

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

//           onlineUsers.add(userId);
//           // broadcastOnlineUsers();

//           // Retrieve and send chat history from the database
//           // const chatHistory = await Message.find({
//           //   $or: [
//           //     { from: userId },
//           //     { to: userId },
//           //   ],
//           // })
//           //   .sort({ timestamp: 1 })
//           //   .select(["from", "to", "content"]);

//           // const chatHistoryData = chatHistory.map((msg) => ({
//           //   from: msg.from ? msg.from.toString() : '',
//           //   to: msg.to ? msg.to.toString() : '',
//           //   content: msg.content,
//           // }));

//           // connection.send(
//           //   JSON.stringify({
//           //     type: "chatHistory",
//           //     data: chatHistoryData,
//           //   })
//           // );

//           // connection.on("message", async (message) => {
//           //   try {
//           //     const parsedMessage = JSON.parse(message);
//           //     const { content, to: recipientUserId } = parsedMessage.data;

//           //     const newMessage = new Message({
//           //       from: connection.userId,
//           //       to: recipientUserId,
//           //       content: content,
//           //     });
//           //     await newMessage.save();

//           //     sendMessagetoClient({
//           //       from: connection.userId,
//           //       to: recipientUserId,
//           //       content: content,
//           //     });

//           //     const recipientConnection = Array.from(wss.clients).find(
//           //       (client) => client.userId === recipientUserId
//           //     );

//           //     if (recipientConnection) {
//           //       // Retrieve and send chat history to the sender and recipient only
//           //       const chatHistory = await Message.find({
//           //         $or: [
//           //           { from: connection.userId, to: recipientUserId },
//           //           { from: recipientUserId, to: connection.userId },
//           //         ],
//           //       })
//           //         .sort({ timestamp: 1 })
//           //         .select(["from", "to", "content"]);

//           //       const chatHistoryData = chatHistory.map((msg) => ({
//           //         from: msg.from.toString(),
//           //         to: msg.to.toString(),
//           //         content: msg.content,
//           //       }));

//           //       connection.send(
//           //         JSON.stringify({
//           //           type: "chatHistory",
//           //           data: chatHistoryData,
//           //         })
//           //       );

//           //       recipientConnection.send(
//           //         JSON.stringify({
//           //           type: "chatHistory",
//           //           data: chatHistoryData,
//           //         })
//           //       );
//           //     }
//           //   } catch (error) {
//           //     console.error("Error saving message:", error);
//           //   }
//           // });
//         }
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         connection.close();
//       }
//     }
//   }

//   connection.send(JSON.stringify({
//     type: "onlineUsers",
//     data: Array.from(onlineUsers).map(userId => ({
//       userId,
//       username: getUsernameById(userId),
//     })),
//   }));

//   // connection.on("close", () => {
//   //   if (connection.userId) {
//   //     onlineUsers.delete(connection.userId);
//   //     broadcastOnlineUsers(); // Move the function call here
//   //   }
//   // });

// //   [...wss.clients].forEach(client =>{
// //     client.send(JSON.stringify(
// //      {
// //       online:  [...wss.clients].map(c=>({userId: c.userId, username: c.username}))
// //      }
// //     ))
// //   })

// // });

// // Inside the "sendMessagetoClient" function
// // function sendMessagetoClient(data) {
// //   wss.clients.forEach((client) => {
// //     if (client.readyState === ws.OPEN) {
// //       client.send(
// //         JSON.stringify({
// //           type: "message",
// //           data: {
// //             ...data,
// //             username: getUsernameById(data.from),
// //           },
// //         })
// //       );
// //     }
// //   });
// // }


const express = require("express");
const app = express();
require("dotenv").config();
const hostname = "localhost";
const port = 5000;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
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
  .connect(process.env.MONGODB)
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

          // const onlineUsersArray = Array.from(onlineUsers).map(user => ({
          //   userId: user,
          //   username: connection.username
          // }))


          // const filteredOnlineUsers = onlineUsersArray.filter(user => user.userId !== userId);

          // connection.send(JSON.stringify({
          //   type: "onlineUsers",
          //   // data: Array.from(onlineUsers).map(userId => ({
          //   //   userId,
          //   //   username: connection.username,
          // data: filteredOnlineUsers,
          // }));

          // Notify all clients about the updated online users
          // broadcastOnlineUsers();
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        connection.close();
      }
    }
  }

  // Notify the current client about online users
  connection.send(JSON.stringify({
    type: "onlineUsers",
    data: Array.from(onlineUsers).map(userId => ({
      userId,
      username: connection.username,
    })),
  }));

  // connection.on("message", async (message) => {
  //   try {
  //     const parsedMessage = JSON.parse(message);
  //     const { content, to: recipientUserId } = parsedMessage.data;

  //     const newMessage = new Message({
  //       from: connection.userId,
  //       to: recipientUserId,
  //       content: content,
  //     });
  //     await newMessage.save();

  //     sendMessagetoClient({
  //       from: connection.userId,
  //       to: recipientUserId,
  //       content: content,
  //     });

  //     const recipientConnection = Array.from(wss.clients).find(
  //       (client) => client.userId === recipientUserId
  //     );

  //     if (recipientConnection) {
  //       // Retrieve and send chat history to the sender and recipient only
  //       const chatHistory = await Message.find({
  //         $or: [
  //           { from: connection.userId, to: recipientUserId },
  //           { from: recipientUserId, to: connection.userId },
  //         ],
  //       })
  //         .sort({ timestamp: 1 })
  //         .select(["from", "to", "content"]);

  //       const chatHistoryData = chatHistory.map((msg) => ({
  //         from: msg.from.toString(),
  //         to: msg.to.toString(),
  //         content: msg.content,
  //       }));

  //       connection.send(
  //         JSON.stringify({
  //           type: "chatHistory",
  //           data: chatHistoryData,
  //         })
  //       );

  //       recipientConnection.send(
  //         JSON.stringify({
  //           type: "chatHistory",
  //           data: chatHistoryData,
  //         })
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error saving message:", error);
  //   }
  // });

  // connection.on("close", () => {
  //   if (connection.userId) {
  //     // Remove user from the Set of online users
  //     onlineUsers.delete(connection.userId);

  //     // Notify all clients about the updated online users
  //     broadcastOnlineUsers();
  //   }
  // });
});

// Function to broadcast online users to all clients
// function broadcastOnlineUsers() {
//   const onlineUsersArray = Array.from(onlineUsers).map(userId => ({
//     userId,
//     username: getUsernameById(userId),
//   }));

//   wss.clients.forEach(client => {
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

// Inside the "sendMessagetoClient" function
// function sendMessagetoClient(data) {
//   wss.clients.forEach((client) => {
//     if (client.readyState === ws.OPEN) {
//       client.send(
//         JSON.stringify({
//           type: "message",
//           data: {
//             ...data,
//             username: getUsernameById(data.from),
//           },
//         })
//       );
//     }
//   });
// }

// ... rest of your code
