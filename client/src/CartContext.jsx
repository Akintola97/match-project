// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const CartContext = createContext();

// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);

//   const fetchCartItems = async () => {
//     try {
//       const response = await axios.get("/user/cart");
//       setCartItems(response.data || []);
//     } catch (error) {
//       console.error("Error fetching cart items:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCartItems();
//   }, []); 

//   console.log(cartItems)

//   const addToCart = async (item, quantity) => {
//     try {
//       await axios.post("/user/cart/add", {
//         itemId: item._id,
//         quantityChange: quantity
//       });
//       fetchCartItems(); // Refresh cart items from the backend
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     }
//   };

//   const removeFromCart = async (itemId) => {
//     try {
//       await axios.delete(`/user/cart/item/${itemId}`);
//       fetchCartItems(); // Refresh cart items from the backend
//     } catch (error) {
//       console.error("Error removing from cart:", error);
//     }
//   };

//   return (
//     <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };
// export default CartProvider;


import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Make sure to import useAuth

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { uId } = useAuth(); // Using the uId from AuthContext to track user login state

  // Fetch cart items only if a user is logged in (i.e., uId is not null)
  const fetchCartItems = async () => {
    if (!uId) return; // Early return if no user is logged in
    try {
      const response = await axios.get("/user/cart");
      // Assuming the response structure is { data: { cart: [] } }, adjust accordingly if different
      setCartItems(response.data || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [uId]); // Adding uId as a dependency ensures fetchCartItems is called when the user logs in or out

  const addToCart = async (item, quantity) => {
    try {
      await axios.post("/user/cart/add", {
        itemId: item._id,
        quantityChange: quantity
      });
      fetchCartItems(); // Refresh cart items from the backend after adding
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`/user/cart/item/${itemId}`);
      fetchCartItems(); // Refresh cart items from the backend after removing
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
