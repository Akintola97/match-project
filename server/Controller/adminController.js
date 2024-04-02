const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const Items = require("../Model/Inventory");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const crypto = require("crypto");

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
