const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const Items = require("../Model/Inventory");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const crypto = require("crypto");
const User = require("../Model/User");
const Profile = require("../Model/Profile");

const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

exports.adminAuthentication = (req, res, next) => {
  const adminToken = req.cookies.authToken;
  if (!adminToken) {
    return res.status(403).send("Access Denied");
  }
  try {
    const decodedToken = jwt.verify(adminToken, secret);
    req.user = decodedToken;
    if (req.user.role !== "admin")
      return res.status(403).send("Access Denied: Admin Only");
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

exports.createItems = async (req, res) => {
  try {
    const file = req.file;
    const newItemData = req.body;

    if (file) {
      const fileStream = fs.createReadStream(file.path);
      const fileName =
        crypto.randomBytes(16).toString("hex") +
        "-" +
        file.originalname.substring(0, 20) +
        "...";
      const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: fileStream,
      };
      try {
        await s3.send(new PutObjectCommand(uploadParams));
        const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${
          process.env.BUCKET_REGION
        }.amazonaws.com/${encodeURIComponent(fileName)}`;
        newItemData.imageUrl = fileUrl;
      } catch (error) {
        console.error("Error uploading object to S3:", error);
        return res.status(500).send("Error uploading image to storage");
      }
    }

    const newItem = new Items(newItemData);
    await newItem.save();
    res.status(200).send(newItem);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await Items.find({});
    res.status(200).send(items);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateItems = async (req, res) => {
  try {
    const file = req.file;
    console.log(file);
    const updateData = req.body;
    console.log(req.body);
    if (file) {
      const fileStream = fs.createReadStream(file.path);
      const fileName =
        crypto.randomBytes(16).toString("hex") +
        "-" +
        file.originalname.substring(0, 20) +
        "...";
      const uploadParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: fileStream,
      };
      try {
        await s3.send(new PutObjectCommand(uploadParams));
        const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${
          process.env.BUCKET_REGION
        }.amazonaws.com/${encodeURIComponent(fileName)}`;
        updateData.imageUrl = fileUrl;
      } catch (error) {
        console.error("Error updating object in S3:", error);
        return res.status(500).send("Error updating image in storage");
      }
    }

    const updateItem = await Items.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updateItem) {
      return res.status(404).send("No item found for update.");
    }
    res.status(200).send(updateItem);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).send(error.message);
  }
};

exports.deleteItems = async (req, res) => {
  try {
    const item = await Items.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(401).send("Items not found.");
    }
    res.status(200).send(item);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const userData = await User.aggregate([
      { $lookup: {
          from: "profiles",
          localField: "_id",
          foreignField: "user",
          as: "profile",
        }},
      { $unwind: "$profile" },
      { $lookup: {
          from: "carts",
          localField: "_id",
          foreignField: "user",
          as: "cart",
        }},
      { $unwind: {
          path: "$cart",
          preserveNullAndEmptyArrays: true, // Preserve users without carts
        }},
      // { $lookup: { // Join cart items with items collection in a single $lookup stage
      //     from: "items",
      //     let: { items: "$cart.items.item" }, // Define variable for cart items' IDs
      //     pipeline: [
      //       { $match: { $expr: { $in: ["$_id", "$$items"] } } } // Match items' IDs with cart items' IDs
      //     ],
      //     as: "cartItemsDetails"
      //   }},
      { $lookup: { // Join cart items with items collection in a single $lookup stage
        from: "items",
        let: { items: { $ifNull: ["$cart.items.item", []] } }, // Ensure items is always an array
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$items"] } } } // Match items' IDs with cart items' IDs
        ],
        as: "cartItemsDetails"
    }},
    
      { $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "user",
          as: "messages",
        }},
      { $project: {
          profile: 1,
          messages: 1,
          cart: {
            items: { // Project cart items combining details from cartItemsDetails and quantity from cart.items
              $ifNull: [{ $map: {
                input: "$cart.items",
                as: "item",
                in: {
                  $mergeObjects: [
                    { $arrayElemAt: [
                      { $filter: {
                        input: "$cartItemsDetails",
                        as: "details",
                        cond: { $eq: ["$$details._id", "$$item.item"] }
                      }},
                      0
                    ]},
                    { quantity: "$$item.quantity" }
                  ]
                }
              }}, []] // Use empty array if cart.items is null
            }
          },
          isActive: "$profile.isActive" // Include isActive field from profile
        }},
    ]);

    res.json(userData);
  } catch (error) {
    console.error("Error fetching admin profile data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};








exports.adminActivateUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("profile");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (!user.profile) {
      return res.status(404).send({ message: "Profile not found" });
    }

    const profile = await Profile.findById(user.profile._id);
    profile.isActive = true;
    await profile.save();

    res.send({ message: "User activated successfully" });
  } catch (error) {
    console.error("Error activating user:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.adminDeactivateUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("profile");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (!user.profile) {
      return res.status(404).send({ message: "Profile not found" });
    }

    const profile = await Profile.findById(user.profile._id);
    profile.isActive = false;
    await profile.save();

    res.send({ message: "User deactivated successfully" });
  } catch (error) {
    console.error("Error activating user:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};


exports.adminDeleteUser = async (req, res) => {
  const { userId } = req.params; // Change from req.body to req.params

  try {
    const profileDeletionResult = await Profile.deleteOne({ user: userId });
    if (profileDeletionResult.deletedCount === 0) {
      console.log(`No profile found for user ID ${userId}, or it was already deleted.`);
    }
    const userDeletionResult = await User.deleteOne({ _id: userId });
    if (userDeletionResult.deletedCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    let responseMessage = "User account deleted successfully.";
    if (profileDeletionResult.deletedCount === 0) {
      responseMessage += " No associated profile found.";
    } else {
      responseMessage += " Associated profile also deleted.";
    }

    res.status(200).json({ message: responseMessage });
  } catch (error) {
    console.error("Error during user deletion:", error);
    res.status(500).json({ message: "Internal server error during deletion process." });
  }
};
