import React from 'react';
import { useCart } from '../CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, addToCart } = useCart();

  return (
    <div className="w-full min-h-screen pt-[10vh]">
      <h2>Your Cart</h2>
      {Object.keys(cartItems).length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {Object.entries(cartItems).map(([itemId, itemDetails]) => (
            <div key={itemId} className="cart-item">
              <img src={itemDetails.imageUrl} alt={itemDetails.name} style={{ width: '100px' }} />
              <h4>{itemDetails.name}</h4>
              <p>Price: ${itemDetails.price}</p>
              <p>Quantity: {itemDetails.quantity}</p>
              <div className="cart-item-actions">
                <button onClick={() => addToCart(itemDetails, 1)}>+</button>
                <button onClick={() => removeFromCart(itemId)}>Remove</button>
                <button onClick={() => removeFromCart(itemId, true)}>-</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
