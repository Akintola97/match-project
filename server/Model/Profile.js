// const mongoose = require("mongoose");

// const profileSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     firstName: {
//       type: String,
//     },
//     birthdate: {
//       type: Date,
//     },
//     rating: {
//       type: String,
//     },
//     email: {
//       type: String,
//     },
//     backupEmail: {
//       type: String,
//       unique: true,
//       sparse: true, // Allow multiple documents to have a null value for the unique index
//     },

//     timeToPlay: {
//       type: String,
//     },
//     gender: {
//       type: String,
//     },
//     selectedDays: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

// const Profile = mongoose.model("Profile", profileSchema);

// module.exports = Profile;

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
    isActive: {
      type: Boolean,
      default: true, // Automatically set profiles as active upon creation
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
