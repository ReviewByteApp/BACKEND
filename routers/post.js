const asyncMiddleware = require("../middleware/async");
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

/**
 * @api {get} /post Request post information
 * @apiName GetPost
 * @apiGroup Post
 *
 *
 * @apiSuccess {Object[]} post postObject
 * @apiSuccess {String} post.title  title of the admin.
 * @apiSuccess {String} admin.description  description about admin.
 * @apiSuccess {String[]} post.images Array of image URLs
 * @apiSuccess {String} admin.video  video of the admin.
 * @apiSuccess {ObjectId} admin.admin admin ID associated with the Admin.
 */

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const posts = await Post.find({});
    // .select("-password")
    res.status(200).send(posts);
  })
);

/**
 * @api {post} /post/:id Create new posts
 * @apiName CreatePost
 * @apiGroup Post
 *
 *@apiParam {objectId} id admin unique ID.
 *
 * @apiSuccess {Object[]} post postObject
 * @apiSuccess {String} post.title  title of the admin.
 * @apiSuccess {String} admin.description  description about admin.
 * @apiSuccess {String[]} post.images Array of image URLs
 * @apiSuccess {String} admin.video  video of the admin.
 * @apiSuccess {ObjectId} admin.admin admin ID associated with the Admin.
 */

router.post(
  "/:id",
  upload.fields([{ name: "images" }, { name: "video" }]),
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    let imagePaths = [];
    let videoPath;

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

        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newPath = path + "." + ext;
        fs.renameSync(path, newPath);
        videoPath = newPath;
      }
    }

    const post = new Post({
      title,
      description,
      images: imagePaths,
      video: videoPath,
      admin: admin._id,
    });

    // Save the post in the database
    await post.save();

    res.status(200).send(post);
  })
);

/**
 * @api {put} /post/:id update posts
 * @apiName UpdatePost
 * @apiGroup Post
 *
 *@apiParam {objectId} id post unique ID.
 *
 * @apiSuccess {Object[]} post postObject
 * @apiSuccess {String} post.title  title of the post.
 * @apiSuccess {String} post.description  description about post.
 * @apiSuccess {String[]} post.images Array of image URLs
 * @apiSuccess {String} post.video  video of the post.
 */

router.put(
  "/:id",
  upload.fields([{ name: "images" }, { name: "video" }]),
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;

    const { title, description } = req.body;

    let imagePaths = [];
    let videoPath;

    // Create a new Post instance
    // let post = await Post.findById(id);
    // if (!post) return res.status(404).send("Post not Found");

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

        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newPath = path + "." + ext;
        fs.renameSync(path, newPath);
        videoPath = newPath;
      }
    }

    post = await Post.findByIdAndUpdate(
      id,
      {
        title,
        description,
        images: imagePaths,
        video: videoPath,
      },
      { new: true }
    );

    if (!post) return res.status(404).send("Post not found with this id");

    res.status(200).send(post);
  })
);

/**
 * @api {delete} /post/:id Delete post
 * @apiName DeletePost
 * @apiGroup Post
 *
 * @apiParam {objectId} id post unique ID.
 *
 * @apiSuccess {Object[]} post post deleted successfully
 */

router.delete(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).send("Post not found with this id");

    res.status(200).send("Post deleted successfully");
  })
);

module.exports = router;
