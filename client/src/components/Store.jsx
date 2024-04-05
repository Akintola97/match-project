import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { useCart } from "../CartContext";

const Store = () => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [categoryFilters, setCategoryFilters] = useState({
    clothing: false,
    rackets: false,
    accessories: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/admin/items");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = (event) => {
    setCategoryFilters({
      ...categoryFilters,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleAddToCart = (item) => {
    addToCart(item, 1);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  };

  const sortedAndFilteredData = () => {
    let result = [...data];

    const filters = Object.entries(categoryFilters)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);

    if (filters.length > 0) {
      result = result.filter((item) => filters.includes(item.category));
    }

    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortOption) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "priceLowHigh":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceHighLow":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return result;
  };

  return (
    <div className="w-full min-h-screen pt-[10vh] bg-gray-900">
      <Box
        sx={{
          display: "flex",
          p: 2,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box sx={{ width: { xs: "100%", md: "25%" }, color: "white" }}>
          <Typography variant="h6" marginBottom={2}>
            Filter by Category:
          </Typography>
          <FormGroup>
            {Object.keys(categoryFilters).map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={categoryFilters[category]}
                    onChange={handleCategoryChange}
                    name={category}
                    sx={{
                      color: "white",
                      "&.Mui-checked": {
                        color: "white",
                      },
                    }}
                  />
                }
                label={
                  <Typography>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
        </Box>
        <Box sx={{ width: { xs: "100%", md: "75%" }, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <TextField
              fullWidth
              label="Search..."
              variant="outlined"
              size="medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputLabelProps={{
                style: { color: "white" },
              }}
              inputProps={{
                style: { color: "white" },
              }}
              sx={{ bgcolor: "grey.800", borderRadius: 1 }}
            />
            <Select
              value={sortOption}
              onChange={handleSortChange}
              displayEmpty
              sx={{
                ".MuiSelect-select": { bgcolor: "grey.800", color: "white" },
                width: { xs: "100%", sm: "auto" },
                ml: 2,
                borderRadius: 1,
              }}
            >
              <MenuItem value="" disabled>
                Sort By
              </MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
              <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
            </Select>
          </Box>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  border: "4px solid green",
                  borderRadius: "50%",
                  width: 100,
                  height: 100,
                  animation: "spin 2s linear infinite",
                }}
              />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {sortedAndFilteredData().length > 0 ? (
                sortedAndFilteredData().map((item) => (
                  <Grid item key={item._id} xs={12} sm={6} md={4}>
                    <Card sx={{ bgcolor: "grey.800" }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={item.imageUrl}
                        alt={item.name}
                      />
                      <CardContent className="text-white capitalize">
                        <Typography gutterBottom variant="h5" component="div">
                          {item.name}
                        </Typography>
                        <Typography>{item.description}</Typography>
                        <Typography marginTop={2}>
                          Price: ${item.price}
                        </Typography>
                        <Typography marginTop={1}>
                          Category: {item.category}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 2 }}
                        >
                          <Button
                            variant="contained"
                            onClick={() => handleRemoveFromCart(item._id)}
                            sx={{
                              bgcolor: "grey.700",
                              color: "white",
                              minWidth: "36px",
                            }}
                          >
                            -
                          </Button>

                          <Typography sx={{ marginX: 2, color: "white" }}>
                          {(cartItems.cart.find(cartItem => cartItem._id === item._id)?.quantity) || 0}

                          </Typography>
                          <Button
                            variant="contained"
                            onClick={() => handleAddToCart(item)}
                            sx={{
                              bgcolor: "grey.700",
                              color: "white",
                              minWidth: "36px",
                            }}
                          >
                            +
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="h6" textAlign="center" color="white">
                    No items found.
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Store;
