const express = require("express");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();
router.use(express.json());

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(404).send("Invalid email or password");

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid)
      return res.status(401).send("Invalid email or password");

    const token = jwt.sign({ adminId: admin._id }, process.env.PRIVATE_KEY, {
      expiresIn: "1h",
    });

    res.status(200).send({ token, name: admin.name });
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
