// // import React from "react";
// // import { useCart } from "../CartContext";
// // import { useSpring, animated } from "react-spring";

// // const Cart = () => {
// //   const { cartItems, removeFromCart, addToCart } = useCart();
// //   console.log(cartItems)

// //   // Spring animation for the cart items
// //   const props = useSpring({
// //     to: { opacity: 1 }, // Corrected to fade in
// //     from: { opacity: 0 },
// //     reset: false,
// //     config: { duration: 500 },
// //   });

// //   return (
// //     <animated.div
// //       style={props}
// //       className="w-full min-h-screen pt-[10vh] bg-gray-900"
// //     >
// //       <h1 className="w-full text-center font-semibold text-[5vmin] text-white">
// //         Cart
// //       </h1>
// //       {Object.keys(cartItems).length === 0 ? (
// //         <div className="w-full h-[50vh]">
// //           <p className="w-full h-full flex justify-center text-[3vmin] items-center font-semibold text-white">
// //             Your cart is empty
// //           </p>
// //         </div>
// //       ) : (
// //         <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 flex-wrap p-5 gap-4">
// //           {Object.entries(cartItems).map(([itemId, itemDetails]) => (
// //             <animated.div
// //               key={itemId}
// //               style={props}
// //               className="bg-white p-3 m-1 rounded-2xl shadow-2xl border border-green-500"
// //             >
// //               {console.log(itemDetails)}
// //               <img
// //                 src={itemDetails.imageUrl}
// //                 alt={itemDetails.name}
// //                 style={{ width: "100px", margin: "auto", display: "block" }}
// //               />
// //               <h4 className="text-xl font-bold mb-2 text-center capitalize p-2 text-green-800">
// //                 {itemDetails.name}
// //               </h4>
// //               <p className="text-center text-green-800">
// //                 Price: ${itemDetails.price}
// //               </p>
// //               <p className="text-center text-green-800">
// //                 Quantity: {itemDetails.quantity}
// //               </p>
// //               <div className="cart-item-actions flex justify-center">
// //                 <button
// //                   onClick={() => addToCart(itemDetails, 1)}
// //                   className="m-1 bg-green-500 text-white font-bold py-2 px-4 rounded"
// //                 >
// //                   +
// //                 </button>
// //                 <button
// //                   onClick={() => removeFromCart(itemId)}
// //                   className="m-1 bg-red-500 text-white font-bold py-2 px-4 rounded"
// //                 >
// //                   Remove
// //                 </button>
// //                 <button
// //                   onClick={() => {
// //                     const currentQuantity = itemDetails.quantity;
// //                     if (currentQuantity > 1) {
// //                       addToCart(itemDetails, -1);
// //                     } else if (currentQuantity === 1) {
// //                       removeFromCart(itemId);
// //                     }
// //                   }}
// //                   className="m-1 bg-blue-500 text-white font-bold py-2 px-4 rounded"
// //                 >
// //                   -
// //                 </button>
// //               </div>
// //             </animated.div>
// //           ))}
// //         </div>
// //       )}
// //     </animated.div>
// //   );
// // };

// // export default Cart;


// // import React from "react";
// // import { useCart } from "../CartContext";
// // import { useSpring, animated } from "react-spring";
// // import {
// //   Card,
// //   CardContent,
// //   CardMedia,
// //   Typography,
// //   Button,
// //   Box,
// // } from "@mui/material"; // Make sure to import necessary components from MUI

// // const Cart = () => {
// //   const { cartItems, removeFromCart, addToCart } = useCart();

// //   // Spring animation for the cart items
// //   const props = useSpring({
// //     to: { opacity: 1 }, // Corrected to fade in
// //     from: { opacity: 0 },
// //     reset: false,
// //     config: { duration: 500 },
// //   });

// //   return (
// //     <animated.div
// //       style={props}
// //       className="w-full min-h-screen pt-[10vh] bg-gray-900"
// //     >
// //       <Typography variant="h3" textAlign="center" color="white" marginBottom={2}>
// //         Cart
// //       </Typography>
// //       {Object.keys(cartItems).length === 0 ? (
// //         <Typography variant="h5" textAlign="center" color="white" marginTop={5}>
// //           Your cart is empty
// //         </Typography>
// //       ) : (
// //         <Box sx={{ p: 2 }}>
// //           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
// //             {Object.entries(cartItems).map(([itemId, itemDetails]) => (
// //               <Card key={itemId} sx={{ width: 300, bgcolor: 'grey.800', color: 'white' }}>
// //                 <CardMedia
// //                   component="img"
// //                   height="140"
// //                   image={itemDetails.imageUrl}
// //                   alt={itemDetails.name}
// //                 />
// //                 <CardContent>
// //                   <Typography gutterBottom variant="h5" component="div">
// //                     {itemDetails.name}
// //                   </Typography>
// //                   <Typography>
// //                     Price: ${itemDetails.price}
// //                   </Typography>
// //                   <Typography marginTop={1}>
// //                     Quantity: {itemDetails.quantity}
// //                   </Typography>
// //                   <Box
// //                     sx={{ display: 'flex', justifyContent: 'center', gap: 1, marginTop: 2 }}
// //                   >
// //                     <Button variant="contained" onClick={() => removeFromCart(itemId)} sx={{ bgcolor: 'grey.700', minWidth: '36px' }}>
// //                       Remove
// //                     </Button>
// //                     <Button variant="contained" onClick={() => addToCart(itemDetails, -1)} sx={{ bgcolor: 'grey.700', minWidth: '36px' }}>
// //                       -
// //                     </Button>
// //                     <Button variant="contained" onClick={() => addToCart(itemDetails, 1)} sx={{ bgcolor: 'grey.700', minWidth: '36px' }}>
// //                       +
// //                     </Button>
// //                   </Box>
// //                 </CardContent>
// //               </Card>
// //             ))}
// //           </Box>
// //         </Box>
// //       )}
// //     </animated.div>
// //   );
// // };

// // export default Cart;


// import React from "react";
// import { useCart } from "../CartContext";
// import { useSpring, animated } from "react-spring";
// import { Card, CardContent, CardMedia, Typography, Button, Grid } from "@mui/material";

// const Cart = () => {
//   const { cartItems, removeFromCart, addToCart } = useCart();
//   const props = useSpring({
//     to: { opacity: 1 },
//     from: { opacity: 0 },
//     reset: false,
//     config: { duration: 500 },
//   });

//   return (
//     <animated.div style={props} className="w-full min-h-screen pt-[10vh] bg-gray-900">
//       <Typography variant="h3" textAlign="center" color="white" marginBottom={2}>
//         Cart
//       </Typography>
//       {Object.keys(cartItems).length === 0 ? (
//         <Typography variant="h5" textAlign="center" color="white" marginTop={5}>
//           Your cart is empty
//         </Typography>
//       ) : (
//         <Grid container spacing={3} justifyContent="center" style={{ padding: '20px' }}>
//           {Object.entries(cartItems).map(([itemId, itemDetails]) => (
//             <Grid item key={itemId} xs={12} sm={6} md={4} lg={3}>
//               <Card sx={{ bgcolor: 'grey.800', color: 'white' }}>
//                 <CardMedia
//                   component="img"
//                   image={itemDetails.imageUrl}
//                   alt={itemDetails.name}
//                   style={{ height: '140px', objectFit: 'cover' }}
//                 />
//                 <CardContent>
//                   <Typography gutterBottom variant="h5" component="div">
//                     {itemDetails.name}
//                   </Typography>
//                   <Typography variant="body2">
//                     Price: ${itemDetails.price}
//                   </Typography>
//                   <Typography variant="body2" marginTop={1}>
//                     Quantity: {itemDetails.quantity}
//                   </Typography>
//                   <Grid container justifyContent="center" spacing={1} marginTop={2}>
//                     <Grid item>
//                       <Button variant="contained" onClick={() => removeFromCart(itemId)} sx={{ bgcolor: 'grey.700' }}>
//                         Remove
//                       </Button>
//                     </Grid>
//                     <Grid item>
//                       <Button variant="contained" onClick={() => addToCart(itemDetails, -1)} sx={{ bgcolor: 'grey.700' }}>
//                         -
//                       </Button>
//                     </Grid>
//                     <Grid item>
//                       <Button variant="contained" onClick={() => addToCart(itemDetails, 1)} sx={{ bgcolor: 'grey.700' }}>
//                         +
//                       </Button>
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </animated.div>
//   );
// };

// export default Cart;


import React from "react";
import { useCart } from "../CartContext";
import { useSpring, animated } from "react-spring";
import { Card, CardContent, CardMedia, Typography, Button, Grid } from "@mui/material";

const Cart = () => {
  const { cartItems, removeFromCart, addToCart } = useCart();
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: false,
    config: { duration: 500 },
  });

  return (
    <animated.div style={props} className="w-full min-h-screen pt-[10vh] bg-gray-900">
      <Typography variant="h3" textAlign="center" color="white" marginBottom={2}>
        Cart
      </Typography>
      {Object.keys(cartItems).length === 0 ? (
        <Typography variant="h5" textAlign="center" color="white" marginTop={5}>
          Your cart is empty
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ p: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
          {Object.entries(cartItems).map(([itemId, itemDetails]) => (
            <Grid item key={itemId} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ bgcolor: 'grey.800', color: 'white' }}>
                <CardMedia
                  component="img"
                  image={itemDetails.imageUrl}
                  alt={itemDetails.name}
                  style={{ height: '140px', objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {itemDetails.name}
                  </Typography>
                  <Typography variant="body2">
                    Price: ${itemDetails.price}
                  </Typography>
                  <Typography variant="body2" marginTop={1}>
                    Quantity: {itemDetails.quantity}
                  </Typography>
                  <Grid container justifyContent="center" spacing={1} marginTop={2}>
                    <Grid item>
                      <Button variant="contained" onClick={() => removeFromCart(itemId)} sx={{ bgcolor: 'grey.700' }}>
                        Remove
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" onClick={() => addToCart(itemDetails, -1)} sx={{ bgcolor: 'grey.700' }}>
                        -
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" onClick={() => addToCart(itemDetails, 1)} sx={{ bgcolor: 'grey.700' }}>
                        +
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </animated.div>
  );
};

export default Cart;
