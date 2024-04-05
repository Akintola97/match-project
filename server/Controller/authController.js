const axios = require("axios");
const User = require("../Model/User");
const secret = process.env.SECRET;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../Model/Profile");
const crypto = require("crypto");
const Message = require("../Model/Message");
const { Types } = require("mongoose");



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
      return res
        .status(200)
        .json({ message: "Profile Incomplete", userId: user._id });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, secret, {
      expiresIn: "1hr",
    });
    res.cookie("authToken", token, {
      path: "/",
      httpOnly: true,
      maxAge: 3600000,
      secure: false,
    });
  //   res.cookie('authToken', token, {
  //     path: '/',
  //     httpOnly: true, // Protects against XSS attacks
  //     maxAge: 3600000, // Cookie expiration time in milliseconds
  //     secure: true, // Ensure cookie is only sent over HTTPS
  //     sameSite: 'none',// Can be 'Strict', 'Lax', or 'None'. 'Lax' is recommended for most cases.
  // });

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
      .json({ firstName: user.firstName, userId, role: user.role });
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
// Assuming you have an authentication middleware to set req.userId
exports.activate = async (req, res) => {
  const userId = req.userId;
  const { isActive } = req.body; // Extract the new isActive state from the request

  try {
      const user = await User.findById(userId).populate("profile");
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Update the isActive status
      user.profile.isActive = isActive;
      await user.profile.save();

      res.json({ success: true, message: `Profile ${isActive ? 'activated' : 'deactivated'} successfully.` });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
  }
};


exports.deleteOrDeactivateUser = async (req, res) => {
  const userId = req.userId; // Assuming `userId` is set by your authentication middleware
  const action = req.params.action;

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // For deleting or deactivating, check if the profile exists
    if (action === 'delete' || action === 'deactivate') {
      const profile = await Profile.findOne({ user: userId });
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
    }

    // Handle each action
    switch (action) {
      case 'delete':
        // Delete the profile
        await Profile.deleteOne({ user: userId });
        // Delete the user account
        await User.deleteOne({ _id: userId });
        res.status(200).json({ message: "User account and profile deleted successfully" });
        break;
      case 'deactivate':
        // Deactivate the user account instead of deleting
        user.isActive = false;
        await user.save();
        res.status(200).json({ message: "User account deactivated successfully" });
        break;
      case 'activate':
        // Reactivate the user account
        user.isActive = true;
        await user.save();
        res.status(200).json({ message: "User account activated successfully" });
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
      return res.status(400).json({ message: "User or profile not found or not active" });
    }

    // Fetch profiles within +-5 years of the user's age, excluding deactivated ones
    const userBirthdate = new Date(user.profile.birthdate);
    const ageThreshold = 5;
    const minBirthdate = new Date(userBirthdate.getFullYear() - ageThreshold, userBirthdate.getMonth(), userBirthdate.getDate());
    const maxBirthdate = new Date(userBirthdate.getFullYear() + ageThreshold, userBirthdate.getMonth(), userBirthdate.getDate());

    const profiles = await Profile.find({
      birthdate: { $gte: minBirthdate, $lte: maxBirthdate },
      isActive: true, // Ensure only active profiles are included
      user: { $ne: userId } // Exclude the current user's profile
    });

    res.status(200).json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};





// exports.hero_page = async (req, res) => {
//   const userId = req.userId;

//   try {
//     const user = await User.findById(userId).populate("profile");
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     // Fetch profiles within +-5 years of the user's age
//     const userBirthdate = new Date(user.profile.birthdate);
//     const ageThreshold = 5;
//     const minBirthdate = new Date(userBirthdate);
//     minBirthdate.setFullYear(userBirthdate.getFullYear() - ageThreshold);

//     const maxBirthdate = new Date(userBirthdate);
//     maxBirthdate.setFullYear(userBirthdate.getFullYear() + ageThreshold);

//     const profiles = await Profile.find({
//       birthdate: { $gte: minBirthdate, $lte: maxBirthdate },
//     });

//     // Exclude the user's own profile from the list
//     const filteredProfiles = profiles.filter(
//       (profile) => profile.user.toString() !== userId
//     );

//     res.status(200).json(filteredProfiles);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };


// exports.messages = async (req, res) => {
//   const { userId } = req.params;
//   const uId = req.userId;
//   try {
//     const messages = await Message.find({
//       sender: { $in: [userId, uId] },
//       recipient: { $in: [userId, uId] },
//     }).sort({ createdAt: 1 });

//     // Update the read status of the messages that have been fetched by the recipient
//     await Message.updateMany(
//       { recipient: uId, sender: userId, read: false },
//       { $set: { read: true } }
//     );

//     res.status(200).json(messages);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };


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
    res.clearCookie('authToken', {
      // path: '/',
      // httpOnly: true,
      // maxAge: 0,
      // secure: false
      path:'/',
      httpOnly: true,
      maxAge: 0,
      secure: true, 
      sameSite: 'None',
  })
    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};



