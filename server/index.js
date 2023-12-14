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

const server = app.listen(port, hostname, () => {
  console.log(`The app is running on ${hostname} ${port}`);
});


const wss = new ws.WebSocketServer({ server });

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


//           connection.send(
//             JSON.stringify({
//               userId: connection.userId,
//             })
//           );
//         }
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }
//   [...wss.clients].forEach((client) => {
//     client.send(
//       JSON.stringify({
//         online: [...wss.clients].map((c) => ({
//           userId: c.userId,
//           username: c.username,
//         })),
//       })
//     );
//   });
// });


wss.on('connection', async (connection, req) => {
  const cookies = req.headers.cookie;

  if (cookies) {
    const authTokenMatch = cookies.match(/authToken=([^;]*)/);
    const authToken = authTokenMatch ? authTokenMatch[1] : null;

    if (authToken) {
      try {
        const decodedToken = jwt.verify(authToken, secret);
        const userId = decodedToken.userId;

        // Mock user data retrieval (replace with your actual logic)
        const user = await User.findById(userId);

        if (user) {
          const { firstName } = user;

          connection.userId = userId;
          connection.username = firstName;

          connection.send(
            JSON.stringify({
              userId: connection.userId,
            })
          );
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }


  connection.on('message', async(message)=>{
    const messageData = JSON.parse(message.toString());
    const {recipient, text} = messageData;
    if (recipient && text){
      const messages = new Message({
        sender: connection.userId,
        recipient,
        text
      });
      [...wss.clients].filter(c => c.userId === recipient)
      .forEach(c => c.send(JSON.stringify({
        text,
        sender: connection.userId,
        recipient,
      })))
    }
  })

  // Send online users information excluding the connected user
  const onlineUsers = [...wss.clients]
    .filter((client) => client.readyState === ws.OPEN && client !== connection)
    .map((c) => ({
      userId: c.userId,
      username: c.username,
    }));

  connection.send(
    JSON.stringify({
      online: onlineUsers,
    })
  );
});