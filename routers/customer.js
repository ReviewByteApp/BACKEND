const asyncMiddleware = require("../middleware/async");
const express = require("express");
const bcrypt = require("bcrypt");
// const Admin = require("../models/Admin");
const Customer = require("../models/Customer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const upload = multer({ dest: "uploads/" });
router.use(express.json());

router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const customers = await Customer.find({});
    // .select("-password")
    res.status(200).send(customers);
  })
);

router.post(
  "/",
  upload.single("profilePicture"),
  asyncMiddleware(async (req, res) => {
    const { name, city, password, email, country } = req.body;
    let profilePicture;

    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      profilePicture = newPath;
    }

    let customer = await Customer.findOne({ email });
    if (customer) return res.status(400).send("Email already exist");
    const hashedPassword = await bcrypt.hash(password, 10);

    customer = new Customer({
      name,
      city,
      password: hashedPassword,
      email,
      country,
      profilePicture: profilePicture,
    });

    await customer.save();
    res.status(200).send(customer);
  })
);

router.delete(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;

    const customer = await Customer.findByIdAndDelete(id);
    if (!customer)
      return res.status(404).send("customer not fund with this id");

    res.status(200).send("customer deleted successfully");
  })
);

module.exports = router;
