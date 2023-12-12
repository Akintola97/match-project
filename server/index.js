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

// const wss = new ws.WebSocketServer({server});
// wss.on('connection', (connection, req)=>{
//   // connection.send('hello');
//   console.log(req.headers)
// // const authToken = req.headers.cookies.authToken;
// // console.log(authToken)

//   // if (cookies){
//   //   const authToken = cookies.authToken;
//   //   console.log(authToken)
//   // }
// })
const wss = new ws.WebSocketServer({ server });

// wss.on('connection', (connection, req) => {
//   // Get the 'authToken' from the cookies in the headers
//   const cookies = req.headers.cookie;
//   if (cookies) {
//     const authTokenMatch = cookies.match(/authToken=([^;]*)/);
//     const authToken = authTokenMatch ? authTokenMatch[1] : null;
//     if (authToken){
//       jwt.verify(authToken, jwtSecret, {}), (err, userInfo)=>{
//         if(err)throw err;
//         const {}
//       }
//     }
//   }

// });

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
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }
  [...wss.clients].forEach((client) => {
    client.send(
      JSON.stringify({
        online: [...wss.clients].map((c) => ({
          userId: c.userId,
          username: c.username,
        })),
      })
    );
  });
});
