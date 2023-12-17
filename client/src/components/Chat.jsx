// import React, { useState, useEffect } from 'react';
// import Avatar from './Avatar';
// import ChatLogo from './ChatLogo';
// import { useAuth } from '../AuthContext';
// import { identity, uniqBy } from 'lodash';
// import axios from 'axios';

// const Chat = () => {
//   const [wsConnection, setWsConnection] = useState(null);
//   const [onlinePeople, setOnlinePeople] = useState({});
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const [newMessage, setNewMessage] = useState('');
//   const [messages, setMessages] = useState([]); // chat messages
//   const { user, uId } = useAuth();

//   useEffect(() => {
//     const connectWebSocket = () => {
//       const newWs = new WebSocket('ws://localhost:5000/user');
//       setWsConnection(newWs);
//       newWs.addEventListener('message', handleMessage);
//       newWs.addEventListener('close', (event) => handleWebSocketClose(event, newWs));
//       return newWs;
//     };

//     let currentWs = connectWebSocket();

//     const handleWebSocketClose = (event, ws) => {
//       console.log('WebSocket connection closed', event);

//       // Reconnect with exponential backoff
//       setTimeout(() => {
//         currentWs = connectWebSocket();
//       }, Math.min(3000 * Math.pow(2, currentWs.reconnectAttempts), 30000));
//     };

//     return () => {
//       // Cleanup: Close the WebSocket connection when the component unmounts
//       currentWs.close();
//     };
//   }, []);

//   function showOnlinePeople(peopleArray) {
//     const people = {};
//     peopleArray.forEach(({ userId, username }) => {
//       people[userId] = username;
//     });
//     setOnlinePeople(people);
//   }

//   function handleMessage(e) {
//     const messageData = JSON.parse(e.data);
//     if ('online' in messageData) {
//       showOnlinePeople(messageData.online);
//     } else if ('text' in messageData) {
//       setMessages(prev => ([...prev, { text: messageData.text }]));
//     }
//   }

//   const handleSendMessage = (e) => {
//     e.preventDefault();

//     if (newMessage && selectedUserId) {
//       const messageData = {
//         recipient: selectedUserId,
//         text: newMessage,
//       };

//       // Update the message history locally
//       setMessages((prevMessage) => [
//         ...prevMessage,
//         { text: newMessage, sender: uId, recipient: selectedUserId, id: Date.now() },
//       ]);

//       // Send the message to the WebSocket server
//       wsConnection.send(JSON.stringify(messageData));

//       // Clear the input field
//       setNewMessage('');
//     }
//   };

//   useEffect(() => {
//     try {
//       if (selectedUserId) {
//         axios.get(`/user/messages/${selectedUserId}`)
//           .then(response => {
//             const messagehistory = response.data;
//             setMessages(messagehistory);
//           })
//           .catch(error => {
//             console.error(error);
//           });
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }, [selectedUserId]);

//   if (!wsConnection) {
//     return null;
//   }

//   const messagesWithoutDupes = uniqBy(messages, '_id');

//   return (
//     <div className='flex min-h-screen'>
//       {/* Sidebar */}
//       <div className='bg-blue-100 w-1/4 p-4 pt-16'>
//         <ChatLogo />
//         <div className='mt-4'>
//           {Object.keys(onlinePeople).map((userId) => (
//             uId !== userId && (
//               <div
//                 key={userId}
//                 onClick={() => setSelectedUserId(userId)}
//                 className={
//                   'py-2 pl-4 flex items-center gap-2 cursor-pointer ' +
//                   (userId === selectedUserId ? 'bg-blue-200' : '')
//                 }
//               >
//                 <Avatar username={onlinePeople[userId]} userId={userId} />
//                 <span className='capitalize text-gray-800 font-medium'>
//                   {onlinePeople[userId]}
//                 </span>
//               </div>
//             )
//           ))}
//         </div>
//       </div>

//       {/* Chat Area */}
//       <div className='flex flex-col bg-gray-100 w-3/4 p-4 pt-20'>
//         {/* Message History */}
//         <div className='flex-grow overflow-y-auto mt-4'>
//           {messagesWithoutDupes.map((message, index) => (
//             <div
//               key={index}
//               className={`${
//                 message.sender === uId ? 'self-end' : 'self-start'
//               } mb-2`}
//             >
//               <div
//                 className={`${
//                   message.sender === uId
//                     ? 'bg-blue-500 text-white rounded-tr-md rounded-bl-md'
//                     : 'bg-gray-300 text-gray-800 rounded-tl-md rounded-br-md'
//                 } p-2 max-w-xs`}
//               >
//                 {message.text}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Message Input */}
//         {selectedUserId && (
//           <div className='mt-4'>
//             <form onSubmit={handleSendMessage} className='flex gap-2'>
//               <input
//                 type='text'
//                 placeholder='Type a message...'
//                 className='flex-grow border rounded p-2 focus:outline-none'
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//               />
//               <button
//                 type='submit'
//                 className='bg-blue-500 p-2 text-white rounded'
//               >
//                 Send
//               </button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Chat;
