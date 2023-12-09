const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    firstName: {
      type: String,
    },
    birthdate: {
      type: Date,
    },
    // age: {
    //     type: Number,
    // },
    rating: {
      type: String,
    },
    email: {
      type: String,
    },
    backupEmail: {
      type: String,

      unique: true,
      sparse: true, // Allow multiple documents to have a null value for the unique index
    },

    timeToPlay: {
      type: String,
    },
    gender: {
      type: String,
    },
    selectedDays: {
      type: String,
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
