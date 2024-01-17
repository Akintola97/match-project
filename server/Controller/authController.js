const axios = require("axios");
const User = require("../Model/User");
const secret = process.env.SECRET;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../Model/Profile");
const crypto = require("crypto");
const Message = require('../Model/Message');


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

    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1hr" });
    res.cookie("authToken", token, {
      path: "/",
      httpOnly: true,
      maxAge: 3600000,
      secure: false,
    });

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

    res.status(200).json({ firstName: user.firstName, userId });
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

// exports.forgotPassword = async (req, res) => {
//   const { email } = await User.findOne({ email });
//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(200);
//     }

//     const resetToken = crypto.randomBytes(20).toString("hex");
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = Date.now() + 300000; //5minutes

//     await user.save();
//   } catch (error) {}
// };



exports.hero_page = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).populate("profile");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Fetch profiles within +-5 years of the user's age
    const userBirthdate = new Date(user.profile.birthdate);
    const ageThreshold = 5;
    const minBirthdate = new Date(userBirthdate);
    minBirthdate.setFullYear(userBirthdate.getFullYear() - ageThreshold);

    const maxBirthdate = new Date(userBirthdate);
    maxBirthdate.setFullYear(userBirthdate.getFullYear() + ageThreshold);

    const profiles = await Profile.find({
      birthdate: { $gte: minBirthdate, $lte: maxBirthdate },
    });

    // Exclude the user's own profile from the list
    const filteredProfiles = profiles.filter(
      (profile) => profile.user.toString() !== userId
    );

    res.status(200).json(filteredProfiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.messages = async (req, res) => {
  const { userId } = req.params;
  const uId = req.userId;
  try {
    const messages = await Message.find({
      sender: { $in: [userId, uId] },
      reciepient: { $in: [userId, uId] },
    }).sort({ createdAt: 1 });
    // console.log(messages);
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.people = async(req, res) =>{
  const users = await User.find({}, {'_id': 1, firstName: 1});
  res.json(users)
}



// exports.getFacilities = async (req, res) => {
//   const { latitude, longitude, distance = 10 } = req.body;

//   try {
//     // Create a user location object using GeoJSON Point
//     const userLocation = {
//       type: 'Point',
//       coordinates: [parseFloat(longitude), parseFloat(latitude)],
//     };

//     // Query facilities based on user location and distance
//     const query = {
//       location: {
//         $near: {
//           $geometry: userLocation,
//           $maxDistance: parseFloat(distance) * 1609.34, // Convert miles to meters
//         },
//       },
//     };

//     const facilities = await Facility.find(query);

//     res.json(facilities);
//   } catch (error) {
//     console.error('Error fetching facilities:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


exports.getFacilities = async (req, res) => {
  const { latitude, longitude } = req.body;
}


exports.logout = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      path: "/",
      httpOnly: true,
      maxAge: 0,
      secure: false,
    });
    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};