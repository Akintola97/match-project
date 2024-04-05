import React from "react";
import { useCart } from "../CartContext";
import { useSpring, animated } from "react-spring";
import { Card, CardContent, CardMedia, Typography, Button, Grid } from "@mui/material";

const Cart = () => {
  const { cartItems, removeFromCart, addToCart, loading } = useCart();
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: false,
    config: { duration: 500 },
  });

  if (loading) {
    return (
      <div className="w-full min-h-screen pt-[10vh] bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <animated.div style={props} className="w-full min-h-screen pt-[10vh] bg-gray-900">
      <Typography variant="h3" textAlign="center" color="white" marginBottom={2}>
        Cart
      </Typography>
      {(!cartItems || !cartItems.cart || cartItems.cart.length === 0) ? (
        <Typography variant="h5" textAlign="center" color="white" marginTop={5}>
          Your cart is empty
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ p: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
          {cartItems.cart.map((itemDetails) => (
            <Grid item key={itemDetails._id} xs={12} sm={6} md={4} lg={3}>
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
                  {/* Assuming 'quantity' is available in itemDetails */}
                  <Typography variant="body2" marginTop={1}>
                    Quantity: {itemDetails.quantity}
                  </Typography>
                  <Grid container justifyContent="center" spacing={1} marginTop={2}>
                    <Grid item>
                      <Button variant="contained" onClick={() => removeFromCart(itemDetails._id)} sx={{ bgcolor: 'grey.700' }}>
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




