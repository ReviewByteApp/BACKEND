const asyncMiddleware = require("../middleware/async");
const express = require("express");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();
router.use(express.json());

/**
 * @api {post} /auth Admin Authentication
 * @apiName adminAuthenticate
 * @apiGroup Admin
 *
 * @apiBody {String} password  password of the admin.
 * @apiBody {String} email  email of the admin.
 *
 * @apiSuccess {Object[]} auth authObject
 * @apiSuccess {String} auth.token The JSON Web Token (JWT) for authentication.
 * @apiSuccess {String} auth.name The name of the admin user.
 */

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) return res.status(404).send("Invalid email or password");

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid)
      return res.status(401).send("Invalid email or password");

    const token = jwt.sign({ adminId: admin._id }, process.env.PRIVATE_KEY, {
      expiresIn: "1h",
    });

    res.status(200).send({ token, name: admin.name });
  })
);

module.exports = router;
