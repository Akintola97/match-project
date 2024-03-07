import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Card, CardContent, CardMedia, Checkbox, FormControlLabel, FormGroup, Typography, Grid, TextField, Select, MenuItem } from "@mui/material";


const Store = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [sortOption, setSortOption] = useState('');
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

  const sortedAndFilteredData = () => {
    const filters = Object.entries(categoryFilters).filter(([_, value]) => value).map(([key, _]) => key);
    let result = filters.length === 0 ? data : data.filter(item => filters.includes(item.category));

    if (searchTerm) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortOption) {
      case "name":
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case "priceLowHigh":
        return result.sort((a, b) => a.price - b.price);
      case "priceHighLow":
        return result.sort((a, b) => b.price - a.price);
      default:
        return result;
    }
  };

  return (
    <div className="w-full min-h-screen pt-[12vh] bg-gray-900">
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ width: '25%', p: 2 }}>
          <Typography variant="h6" marginBottom={2} color="white">Filter by Category:</Typography>
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
                      color: 'white',
                      '&.Mui-checked': {
                        color: 'white',
                      },
                    }}
                  />
                }
                label={<Typography color="white">{category.charAt(0).toUpperCase() + category.slice(1)}</Typography>}
              />
            ))}
          </FormGroup>
        </Box>
        <Box sx={{ width: '75%', p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ input: { color: 'white' }, label: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' }, '&:hover fieldset': { borderColor: 'white' }, '&.Mui-focused fieldset': { borderColor: 'white' } } }}
            />
            <Select
              value={sortOption}
              onChange={handleSortChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ '.MuiSelect-select': { color: 'white', borderColor: 'white' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
            >
              <MenuItem value="" disabled>Sort By</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
              <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
            </Select>
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Box sx={{ border: '4px solid green', borderRadius: '50%', width: 100, height: 100, animation: 'spin 2s linear infinite' }} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {sortedAndFilteredData().length > 0 ? sortedAndFilteredData().map((item) => (
                <Grid item key={item._id} xs={12} sm={6} md={4}>
                  <Card sx={{ maxWidth: 345, bgcolor: 'grey.900' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.imageUrl}
                      alt={item.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div" color="white">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="white">
                        {item.description}
                      </Typography>
                      <Typography variant="body1" marginTop={2} color="white">
                        Price: ${item.price}
                      </Typography>
                      <Typography variant="body2" marginTop={1} color="white">
                        Category: {item.category}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )) : (
                <Typography variant="h6" textAlign="center" width="100%" color="white">No items found.</Typography>
              )}
            </Grid>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Store;
