const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

const router = express.Router();

// Load the Post model
const Post = require("../models/Post");
const Admin = require("../models/Admin");

router.use(express.json());
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

router.post(
  "/:id",
  upload.fields([{ name: "images" }, { name: "video" }]),
  async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;

    let imagePaths = [];
    let videoPath;

    try {
      // Create a new Post instance
      const admin = await Admin.findById(id);
      if (!admin) return res.status(404).send("Admin not Found");

      if (req.files) {
        if (req.files.images) {
          // Handle image file upload
          req.files.images.forEach((file) => {
            const { originalname, path } = file;
            const parts = originalname.split(".");
            const ext = parts[parts.length - 1];
            const newPath = path + "." + ext;
            fs.renameSync(path, newPath);
            imagePaths.push(newPath);
          });
        }

        if (req.files.video) {
          // Handle video file upload

          const { originalname, path } = req.files.video[0];
          // if (size > upload.limits.fileSize) {
          //   // Video file is too large
          //   fs.unlinkSync(path); // Delete the uploaded file
          //   return res
          //     .status(400)
          //     .send("Video file size exceeds the allowed limit.");
          // }
          const parts = originalname.split(".");
          const ext = parts[parts.length - 1];
          const newPath = path + "." + ext;
          fs.renameSync(path, newPath);
          videoPath = newPath;
        }
      }

      const post = new Post({
        name,
        description,
        price,
        images: imagePaths,
        video: videoPath,
        admin: admin._id,
      });

      // Save the post in the database
      await post.save();

      res.status(200).send(post);
    } catch (ex) {
      console.log(ex);
      res.status(500).send("Internal server error.");
    }
  }
);

module.exports = router;
