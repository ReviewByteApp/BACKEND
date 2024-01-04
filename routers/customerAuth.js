const asyncMiddleware = require("../middleware/async");
const express = require("express");
const Customer = require("../models/Customer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();
router.use(express.json());

/**
 * @api {post} /customerAuth Customer Authentication
 * @apiName customerAuthenticate
 * @apiGroup Customer
 *
 * @apiBody {String} password  password of the customer.
 * @apiBody {String} email  email of the customer.
 *
 * @apiSuccess {Object[]} customerAuth customerAuthObject
 * @apiSuccess {String} customerAuth.token The JSON Web Token (JWT) for authentication.
 * @apiSuccess {String} customerAuth.name The name of the customer.
 */

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });

    if (!customer) return res.status(404).send("Invalid email or password");

    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid)
      return res.status(401).send("Invalid email or password");

    const token = jwt.sign(
      { customerId: customer._id },
      process.env.CUSTOMER_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).send({ token, name: customer.name });
  })
);

module.exports = router;
