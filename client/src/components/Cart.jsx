import React from "react";
import { useCart } from "../CartContext";
import { useSpring, animated } from "react-spring";

const Cart = () => {
  const { cartItems, removeFromCart, addToCart } = useCart();

  // Spring animation for the cart items
  const props = useSpring({
    to: { opacity: 1 }, // Corrected to fade in
    from: { opacity: 0 },
    reset: false,
    config: { duration: 500 },
  });

  return (
    <animated.div
      style={props}
      className="w-full min-h-screen pt-[10vh] bg-gray-900"
    >
      <h1 className="w-full text-center font-semibold text-[5vmin] text-white">
        Cart
      </h1>
      {Object.keys(cartItems).length === 0 ? (
        <div className="w-full h-[50vh]">
          <p className="w-full h-full flex justify-center text-[3vmin] items-center font-semibold text-white">
            Your cart is empty
          </p>
        </div>
      ) : (
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 flex-wrap p-5 gap-4">
          {Object.entries(cartItems).map(([itemId, itemDetails]) => (
            <animated.div
              key={itemId}
              style={props}
              className="bg-white p-3 m-1 rounded-2xl shadow-2xl border border-green-500"
            >
              <img
                src={itemDetails.imageUrl}
                alt={itemDetails.name}
                style={{ width: "100px", margin: "auto", display: "block" }}
              />
              <h4 className="text-xl font-bold mb-2 text-center capitalize p-2 text-green-800">
                {itemDetails.name}
              </h4>
              <p className="text-center text-green-800">
                Price: ${itemDetails.price}
              </p>
              <p className="text-center text-green-800">
                Quantity: {itemDetails.quantity}
              </p>
              <div className="cart-item-actions flex justify-center">
                <button
                  onClick={() => addToCart(itemDetails, 1)}
                  className="m-1 bg-green-500 text-white font-bold py-2 px-4 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(itemId)}
                  className="m-1 bg-red-500 text-white font-bold py-2 px-4 rounded"
                >
                  Remove
                </button>
                <button
                  onClick={() => {
                    const currentQuantity = itemDetails.quantity;
                    if (currentQuantity > 1) {
                      addToCart(itemDetails, -1);
                    } else if (currentQuantity === 1) {
                      removeFromCart(itemId);
                    }
                  }}
                  className="m-1 bg-blue-500 text-white font-bold py-2 px-4 rounded"
                >
                  -
                </button>
              </div>
            </animated.div>
          ))}
        </div>
      )}
    </animated.div>
  );
};

export default Cart;
