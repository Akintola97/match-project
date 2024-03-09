import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem("cartItems");
    return localData ? JSON.parse(localData) : {};
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);


  console.log(cartItems)




  const addToCart = (item, quantity) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems[item._id];
      const updatedQuantity = existingItem
        ? existingItem.quantity + quantity
        : quantity;
      const updatedItems = {
        ...prevItems,
        [item._id]: { ...item, quantity: updatedQuantity },
      };
      return updatedItems;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
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
