// import React, { createContext, useContext, useState, useEffect } from "react";

// const CartContext = createContext();
// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState(() => {
//     const localData = localStorage.getItem("cartItems");
//     return localData ? JSON.parse(localData) : {};
//   });

//   useEffect(() => {
//     localStorage.setItem("cartItems", JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (item, quantity) => {
//     setCartItems((prevItems) => {
//       const existingItem = prevItems[item._id];
//       const updatedQuantity = existingItem
//         ? existingItem.quantity + quantity
//         : quantity;
//       const updatedItems = {
//         ...prevItems,
//         [item._id]: { ...item, quantity: updatedQuantity },
//       };
//       return updatedItems;
//     });
//   };

//   const removeFromCart = (itemId) => {
//     setCartItems((prevItems) => {
//       const updatedItems = { ...prevItems };
//       delete updatedItems[itemId];
//       return updatedItems;
//     });
//   };

//   return (
//     <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;

// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const CartContext = createContext();
// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//   const [userId, setUserId] = useState("");
//   const [cartItems, setCartItems] = useState({});
//   const [loading, setLoading] = useState(true)
//   useEffect(() => {
//     console.log("fetchUserId called");
//     fetchUserId();
//   }, []);

//   const fetchUserId = async () => {
//     try {
//       const response = await axios.get("/user/userinfo");
//       setUserId(response.data.userId);
//       console.log(response.data.userId);
//     } catch (error) {
//       console.error("Error fetching user info:", error);
//     }
//   };



//   // Load cart items from localStorage after userId is set
//   useEffect(() => {
//     if (userId) {
//       const userSpecificKey = `cartItems-${userId}`;
//       const localData = localStorage.getItem(userSpecificKey);
//       if (localData) {
//         setCartItems(JSON.parse(localData));
//       }
//     }
//   }, [userId]); 

//   // Save cartItems to localStorage whenever they change, after userId is available
//   useEffect(() => {
//     if (userId) {
//       const userSpecificKey = `cartItems-${userId}`;
//       localStorage.setItem(userSpecificKey, JSON.stringify(cartItems));
//     }
//   }, [cartItems, userId]);

//   const addToCart = (item, quantity) => {
//     setCartItems((prevItems) => {
//       const existingItem = prevItems[item._id];
//       const updatedQuantity = existingItem
//         ? existingItem.quantity + quantity
//         : quantity;
//       const updatedItems = {
//         ...prevItems,
//         [item._id]: { ...item, quantity: updatedQuantity },
//       };
//       return updatedItems;
//     });
//   };

//   const removeFromCart = (itemId) => {
//     setCartItems((prevItems) => {
//       const updatedItems = { ...prevItems };
//       delete updatedItems[itemId];
//       return updatedItems;
//     });
//   };

//   return (
//     <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartProvider;


import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; 

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { uId } = useAuth(); 
  const [cartItems, setCartItems] = useState({});

  console.log(uId)

  useEffect(() => {
    if (uId) {
      const userSpecificKey = `cartItems-${uId}`;
      const localData = localStorage.getItem(userSpecificKey);
      setCartItems(localData ? JSON.parse(localData) : {});
    }
  }, [uId]);

  useEffect(() => {
    if (uId) {
      const userSpecificKey = `cartItems-${uId}`;
      localStorage.setItem(userSpecificKey, JSON.stringify(cartItems));
    }
  }, [cartItems, uId]);

  const addToCart = (item, quantity) => {
    setCartItems(prevItems => {
      const existingItem = prevItems[item._id];
      const updatedQuantity = existingItem
        ? existingItem.quantity + quantity
        : quantity;
      return { ...prevItems, [item._id]: { ...item, quantity: updatedQuantity }};
    });
  };

  const removeFromCart = itemId => {
    setCartItems(prevItems => {
      const updatedItems = { ...prevItems };
      delete updatedItems[itemId];
      return updatedItems;
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};


export default CartProvider;