const axios = require("axios");
const User = require("../Model/User");
const secret = process.env.SECRET;
const map_api = process.env.MAP_API;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../Model/Profile");
const crypto = require("crypto");
const Message = require("../Model/Message");
const { Types } = require("mongoose");
const Cart = require("../Model/Cart");

exports.register = async (req, res) => {
  try {
    const { firstName, password, email } = req.body;
    if (!firstName || !password || !email) {
      return res
        .status(401)
        .json({ message: "Please fill out the form correctly" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User exists. Please Login" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      password: hashPassword,
      email,
    });

    // Save the new user
    await newUser.save();

    // Create a new profile
    const newProfile = new Profile({
      user: newUser._id,
      firstName: "",
      // age: "",
      timeToPlay: "",
      selectedDays: "",
      rating: "",
      backupEmail: `${email}_backup`,
      birthdate: "",
    });

    // Save the new profile
    await newProfile.save();

    // Associate the new profile with the user
    newUser.profile = newProfile._id;

    // Save the user with the profile association
    await newUser.save();

    return res
      .status(200)
      .json({ message: "User Created", userId: newUser._id });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ errorMessage: "Invalid Credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ errorMessage: "Invalid Credentials" });
    }

    if (!user.profile) {
      return (
        res
          .status(200)
          .json({ message: "Profile Incomplete" })
      );
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, secret, {
      expiresIn: "1hr",
    });

    if (process.env.NODE_ENV === "production") {
      res.cookie("authToken", token, {
        path: "/",
        httpOnly: true,
        maxAge: 3600000,
        secure: true,
        sameSite: "none",
      });
    } else {
      res.cookie("authToken", token, {
        path: "/",
        httpOnly: true,
        maxAge: 3600000,
        secure: false,
      });
    }

    if (
      !user.profile.age ||
      !user.profile.timeToPlay ||
      !user.profile.selectedDays
    ) {
      return res
        .status(200)
        .json({ message: "Profile Incomplete", firstName: user.firstName });
    }
    if (
      user.profile.age === "" ||
      user.profile.timeToPlay === "" ||
      user.profile.selectedDays === ""
    ) {
      return res
        .status(200)
        .json({ message: "Profile Incomplete", firstName: user.firstName });
    }

    res
      .status(200)
      .json({ message: "Login Successful", firstName: user.firstName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.authenticate = async (req, res, next) => {
  const authToken = req.cookies.authToken;

  if (!authToken) {
    return res
      .status(401)
      .json({ message: "Authentication failed - Token missing" });
  }

  try {
    const decodedToken = jwt.verify(authToken, secret);
    const userId = decodedToken.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const tokenExpiration = new Date(decodedToken.exp * 1000);
    if (tokenExpiration <= new Date()) {
      return res
        .status(401)
        .json({ message: "Authentication failed - Token expired" });
    }

    req.userId = userId;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "User not found" });
  }
};

exports.userInfo = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ userId, role: user.role, firstName: user.firstName });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).populate("profile");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const profileData = {
      firstName: user.firstName,
      email: user.email,
      rating: user.profile.rating,
      timeToPlay: user.profile.timeToPlay,
      selectedDays: user.profile.selectedDays,
      gender: user.profile.gender,
      backupEmail: user.profile.backupEmail,
      birthdate: user.profile.birthdate,
      isActive: user.profile.isActive,
    };
    res.status(200).json(profileData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.userId;
  const {
    firstName,
    email,
    timeToPlay,
    selectedDays,
    rating,
    backupEmail,
    gender,
    birthdate,
  } = req.body;

  try {
    const user = await User.findById(userId).populate("profile");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!selectedDays || selectedDays.length === 0) {
      return res
        .status(400)
        .json({ message: "Please select at least one day to play!" });
    }

    user.profile.firstName = firstName || user.profile.firstName;
    user.profile.rating = rating || user.profile.rating;
    user.profile.timeToPlay = timeToPlay || user.profile.timeToPlay;
    user.profile.selectedDays = selectedDays || user.profile.selectedDays;
    user.profile.gender = gender || user.profile.gender;
    user.profile.backupEmail = backupEmail || user.profile.backupEmail;
    user.profile.email = email || user.profile.email;
    user.profile.birthdate = birthdate || user.profile.birthdate;

    await user.profile.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.activate = async (req, res) => {
  const userId = req.userId;
  const { isActive } = req.body;

  try {
    const user = await User.findById(userId).populate("profile");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profile.isActive = isActive;
    await user.profile.save();

    res.json({
      success: true,
      message: `Profile ${
        isActive ? "activated" : "deactivated"
      } successfully.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.deleteOrDeactivateUser = async (req, res) => {
  const userId = req.userId;
  const action = req.params.action;

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // For deleting or deactivating, check if the profile exists
    if (action === "delete" || action === "deactivate") {
      const profile = await Profile.findOne({ user: userId });
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
    }

    // Handle each action
    switch (action) {
      case "delete":
        // Delete the profile
        await Profile.deleteOne({ user: userId });
        // Delete the user account
        await User.deleteOne({ _id: userId });
        res
          .status(200)
          .json({ message: "User account and profile deleted successfully" });
        break;
      case "deactivate":
        // Deactivate the user account instead of deleting
        user.isActive = false;
        await user.save();
        res
          .status(200)
          .json({ message: "User account deactivated successfully" });
        break;
      case "activate":
        // Reactivate the user account
        user.isActive = true;
        await user.save();
        res
          .status(200)
          .json({ message: "User account activated successfully" });
        break;
      default:
        // If the action is not recognized, return an error
        res.status(400).json({ message: "Invalid action" });
        break;
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.hero_page = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).populate("profile");
    if (!user || !user.profile || !user.profile.isActive) {
      // Check if user or user's profile is not found or not active
      return res
        .status(400)
        .json({ message: "User or profile not found or not active" });
    }

    // Fetch profiles within +-5 years of the user's age, excluding deactivated ones
    const userBirthdate = new Date(user.profile.birthdate);
    const ageThreshold = 5;
    const minBirthdate = new Date(
      userBirthdate.getFullYear() - ageThreshold,
      userBirthdate.getMonth(),
      userBirthdate.getDate()
    );
    const maxBirthdate = new Date(
      userBirthdate.getFullYear() + ageThreshold,
      userBirthdate.getMonth(),
      userBirthdate.getDate()
    );

    const profiles = await Profile.find({
      birthdate: { $gte: minBirthdate, $lte: maxBirthdate },
      isActive: true, // Ensure only active profiles are included
      user: { $ne: userId }, // Exclude the current user's profile
    });

    res.status(200).json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.people = async (req, res) => {
  try {
    const { q } = req.query; // Extract the search query from the request query parameters
    const userId = req.userId; // Assuming userId is available in req

    let query = {}; // Default query object

    if (q) {
      // If a search query is provided, filter by username or any other relevant fields
      query = {
        $and: [
          {
            $or: [
              { firstName: { $regex: q, $options: "i" } }, // Case-insensitive search on firstName
              // Add more fields as needed for search
            ],
          },
          { _id: { $ne: new Types.ObjectId(userId) } }, // Exclude the currently logged-in user
        ],
      };
    } else {
      // If no search query, just exclude the currently logged-in user
      query = { _id: { $ne: new Types.ObjectId(userId) } };
    }

    const users = await User.find(query, { _id: 1, firstName: 1 });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.logout = async (req, res) => {
  try {
    if (process.env.NODE_ENV === "production") {
      res.clearCookie("authToken", {
        path: "/",
        httpOnly: true,
        maxAge: 0,
        secure: true,
        sameSite: "None",
      });
    } else {
      res.clearCookie("authToken", {
        path: "/",
        httpOnly: true,
        maxAge: 0,
        secure: false,
      });
    }
    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.addToCart = async (req, res) => {
  const userId = req.userId;
  const { itemId, quantityChange } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      // Create a new cart if it doesn't exist, linking it to the user via the user field
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.item.toString() === itemId
    );

    if (itemIndex > -1) {
      // Update item quantity if it exists in the cart
      cart.items[itemIndex].quantity += quantityChange;
      if (cart.items[itemIndex].quantity <= 0) {
        // Remove the item if quantity falls to 0 or less
        cart.items.splice(itemIndex, 1);
      }
    } else if (quantityChange > 0) {
      // Add the item to the cart if it doesn't exist and quantityChange is positive
      cart.items.push({ item: itemId, quantity: quantityChange });
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Error updating cart" });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.userId;

  try {
    // Find the cart based on the user field and populate item details
    const cart = await Cart.findOne({ user: userId }).populate("items.item");
    if (!cart) {
      // If no cart found for the user, return an appropriate message or an empty cart structure
      return res
        .status(404)
        .json({ message: "No cart found for the given user", cart: [] });
    }
    const transformedItems = cart.items.reduce((acc, { item, quantity }) => {
      if (item) {
        acc.push({
          _id: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl,
          category: item.category,
          quantity,
        });
      } else {
        console.log(
          `Missing item details for cart item with quantity ${quantity}`
        );
      }
      return acc;
    }, []);

    res.status(200).json({ cart: transformedItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

exports.removeFromCart = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.userId;

  try {
    // Adjusted to use findOne and search for a cart by the user field
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      // Remove the item from the cart
      cart.items = cart.items.filter((item) => item.item.toString() !== itemId);
      await cart.save();
      res.status(200).json({ message: "Item removed from cart", cart });
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Error removing item from cart" });
  }
};

exports.getFacilities = async (req, res) => {
  let { latitude, longitude, zipCode } = req.body;
  if (zipCode) {
    try {
      const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${map_api}`
      );
      const location = geocodeResponse.data.results[0].geometry.location;
      latitude = location.lat;
      longitude = location.lng;
    } catch (error) {
      console.error("Error converting zip code to coordinates:", error);
      return res.status(500).send("Error converting zip code to coordinates");
    }
  }

  try {
    const searchResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=tennis_court&keyword=Tennis&key=${map_api}`
    );
    const facilities = searchResponse.data.results;

    const images = facilities.map((facility) => {
      if (facility.photos && facility.photos.length > 0) {
        return facility.photos.map((photo) => {
          return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${map_api}`;
        });
      } else {
        return [];
      }
    });

    const responseData = facilities.map((facility, index) => ({
      name: facility.name,
      photos: images[index],
      rating: facility.rating,
      available: facility.opening_hours,
    }));
    res.json(responseData);
  } catch (error) {
    console.error("Error fetching facility details:", error);
    res.status(500).send("Internal Server Error");
  }
};
