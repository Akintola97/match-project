// // import React from 'react'
// // import { Link } from 'react-router-dom'
// // import { useAuth } from '../AuthContext'
// // import NotificationsIcon from "@mui/icons-material/Notifications";

// // const NotificationMenu = ({notifications, clearNotifications}) => {
// //   return (
// //     <div className='relative'>
// //         <NotificationsIcon className='cursor-pointer text-2xl'/>
// //     </div>
// //   )
// // }

// // export default NotificationMenu

// import React, { useState } from 'react';
// import { Button, Popover, List, ListItem, ListItemText } from '@mui/material';
// import NotificationsIcon from '@mui/icons-material/Notifications';

// const NotificationMenu = ({ notifications, clearNotifications }) => {
//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <div className='relative'>
//       <NotificationsIcon className='cursor-pointer text-2xl' onClick={handleClick} />

//       <Popover
//         open={Boolean(anchorEl)}
//         anchorEl={anchorEl}
//         onClose={handleClose}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'right',
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'right',
//         }}
//       >
//         <List>
//           {notifications.map((notification, index) => (
//             <ListItem key={index} onClick={handleClose}>
//               <ListItemText primary={notification.text} secondary={`From: ${notification.sender}`} />
//             </ListItem>
//           ))}
//         </List>

//         {notifications.length > 0 && (
//           <Button onClick={clearNotifications} variant="outlined" color="primary">
//             Clear Notifications
//           </Button>
//         )}
//       </Popover>
//     </div>
//   );
// };

// export default NotificationMenu;
