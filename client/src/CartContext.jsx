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


// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from './AuthContext'; // Make sure to import useAuth

// const CartContext = createContext();

// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const { uId } = useAuth(); // Using the uId from AuthContext to track user login state

//   // Fetch cart items only if a user is logged in (i.e., uId is not null)
//   const fetchCartItems = async () => {
//     if (!uId) return; // Early return if no user is logged in
//     try {
//       const response = await axios.get("/user/cart");
//       // Assuming the response structure is { data: { cart: [] } }, adjust accordingly if different
//       setCartItems(response.data || []);
//     } catch (error) {
//       console.error("Error fetching cart items:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCartItems();
//   }, [uId]); // Adding uId as a dependency ensures fetchCartItems is called when the user logs in or out

//   const addToCart = async (item, quantity) => {
//     try {
//       await axios.post("/user/cart/add", {
//         itemId: item._id,
//         quantityChange: quantity
//       });
//       fetchCartItems(); // Refresh cart items from the backend after adding
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//     }
//   };

//   const removeFromCart = async (itemId) => {
//     try {
//       await axios.delete(`/user/cart/item/${itemId}`);
//       fetchCartItems(); // Refresh cart items from the backend after removing
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
import { useAuth } from './AuthContext'; // Ensure this is correctly imported

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const { uId } = useAuth(); // Using the uId from AuthContext

  // Fetch cart items only if a user is logged in (i.e., uId is not null)
  const fetchCartItems = async () => {
    if (!uId) {
      setCartItems([]); // Clear cart items if no user is logged in
      setLoading(false); // Set loading to false as there are no items to fetch
      return;
    }
    try {
      const response = await axios.get("/user/cart");
      // Adjust according to your actual API response structure
      setCartItems(response.data || []);
      setLoading(false); // Set loading to false after fetching items
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setLoading(false); // Ensure loading is set to false even on error
    }
  };

  useEffect(() => {
    setLoading(true); // Set loading to true at the start of the fetch operation
    fetchCartItems();
  }, [uId]); // Depend on uId to re-fetch when the user logs in or out

  const addToCart = async (item, quantity) => {
    try {
      await axios.post("/user/cart/add", { itemId: item._id, quantityChange: quantity });
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
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, loading }}>
      {/* {!loading ? children : <div>Loading cart...</div>} */}
      {!loading ? (
        children
      ) : (
        <div className="w-full min-h-screen pt-[10vh] bg-gray-900 flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export default CartProvider;
