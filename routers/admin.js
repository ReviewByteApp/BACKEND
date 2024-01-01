const express = require("express");
const bcrypt = require("bcrypt");
// const Admin = require("../models/Admin");
const Admin = require("../models/Admin");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const upload = multer({ dest: "uploads/" });
router.use(express.json());

router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find({}).select("-password");
    res.status(200).send(admins);
  } catch (ex) {
    res.status(500).send("Internal server error.");
  }
});

router.post("/", upload.single("profilepicture"), async (req, res) => {
  const { name, password, email, category, location, description } = req.body;
  let profilePicture;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    profilePicture = newPath;
  }
  try {
    let admin = await Admin.findOne({ email });
    if (admin) return res.status(400).send("Email already exist");
    const hashedPassword = await bcrypt.hash(password, 10);
    admin = new Admin({
      name,
      password: hashedPassword,
      email,
      category,
      location,
      description,
      profilePicture,
    });

    await admin.save();

    admin = await Admin.findById(admin._id).select("-password");

    res.status(200).send(admin);
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, password, email, category, location, description } = req.body;
  let profilePicture;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    profilePicture = newPath;
  }
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin && existingAdmin._id.toString() !== id) {
      return res.status(400).send("Email already exists for another Admin");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let admin = await Admin.findByIdAndUpdate(id, {
      name,
      password: hashedPassword,
      email,
      category,
      location,
      description,
      profilePicture,
    });
    if (!admin) return res.status(404).send("Admin not fund with this id");

    admin = await Admin.findById(admin._id).select("-password");

    res.status(200).send(admin);
  } catch (ex) {
    res.status(500).send("Internal server error.");
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) return res.status(404).send("Admin not fund with this id");

    res.status(200).send("Admin deleted successfully");
  } catch (ex) {
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
