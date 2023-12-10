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
const ws = require('ws');
const jwt = require('jsonwebtoken');
const { userInfo } = require("./Controller/authController");
const User = require("./Model/User");
const secret = process.env.SECRET;


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

// const wss = new ws.WebSocketServer({ server });

// wss.on('connection', (connection, req, res) => {
//   const cookies = req.headers.cookie;

//   if (cookies) {
//     const token = cookies.split(';').map(str => str.trim()).find(str => str.startsWith('authToken='));
    
//     if (token) {
//       const authToken = token.split('=')[1].trim();
//       if(authToken){
//         jwt.verify(authToken, secret, {}, async (err, decodedToken)=>{
//           if(err) throw err;
//           const userId = decodedToken.userId;
//           const user = await User.findById(userId);

//           if(!user){
//             return res.status(400).json({message:'User not found'});
//           }
//           const tokenExpiration = new Date(decodedToken.exp * 1000);
//           if (tokenExpiration <= new Date()) {
//             return res.status(401).json({ message: "Authentication failed - Token expired" });
//           }
//           connection.userInfo = {
//             userId: user._id,
//             firstName: user.firstName,
//           };
//           [...wss.clients].forEach(client =>{
//             client.send(JSON.stringify(
//               [...wss.clients].map(c =>({userId:c.userInfo.userId, firstName:c.userInfo.firstName}))
//             ))
//           });
//         } )
//       }
//     }
//   }
// });

// const wss = new ws.WebSocketServer({ server });

// wss.on('connection', (connection, req, res) => {
//   const cookies = req.headers.cookie;

//   if (cookies) {
//     const token = cookies.split(';').map(str => str.trim()).find(str => str.startsWith('authToken='));

//     if (token) {
//       const authToken = token.split('=')[1].trim();
//       if(authToken){
//         jwt.verify(authToken, secret, {}, async (err, decodedToken)=>{
//           if(err) throw err;
//           const userId = decodedToken.userId;
//           const user = await User.findById(userId);

//           if(!user){
//             return res.status(400).json({message:'User not found'});
//           }
//           const tokenExpiration = new Date(decodedToken.exp * 1000);
//           if (tokenExpiration <= new Date()) {
//             return res.status(401).json({ message: "Authentication failed - Token expired" });
//           }
//           connection.userInfo = {
//             userId: user._id,
//             firstName: user.firstName,
//           };

//           // Filter out clients without userInfo
//           const clientsWithUserInfo = [...wss.clients].filter(c => c.userInfo);

//           // Send user information to all clients with userInfo
//           clientsWithUserInfo.forEach(client => {
//             client.send(JSON.stringify(
//             clientsWithUserInfo.map(c => ({ userId: c.userInfo.userId, firstName: c.userInfo.firstName }))
//             ));
//           });
//         });
//       }
//     }
//   }
// });



