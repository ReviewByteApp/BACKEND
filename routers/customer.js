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

/**
 * @api {get} /customer Request customer information
 * @apiName GetCustomer
 * @apiGroup Customer
 *
 *
 * @apiSuccess {Object[]} customer customerObject
 * @apiSuccess {String} customer.name  name of the customer.
 * @apiSuccess {String} customer.country  country of the customer
 * @apiSuccess {String} customer.city city of customer
 * @apiSuccess {String} customer.profilePicture  profilePicture of the customer.
 *@apiSuccess {String} customer.email  email of the customer.
 * @apiSuccess {Number} customer.reviewCount  reviewCount of the customer.
 * @apiSuccess {String} customer.password  password of the customer.
 */

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const customers = await Customer.find({});
    // .select("-password")
    res.status(200).send(customers);
  })
);

/**
 * @api {post} /post Create new customer
 * @apiName CreateCustomer
 * @apiGroup Post
 *
 *
 * @apiSuccess {Object[]} customer postObject
 * @apiSuccess {String} customer.name  name of the customer.
 * @apiSuccess {String} customer.country  country of the customer
 * @apiSuccess {String} customer.city city of customer
 * @apiSuccess {String} customer.profilePicture  profilePicture of the customer.
 *@apiSuccess {String} customer.email  email of the customer.
 * @apiSuccess {Number} customer.reviewCount reviewCount of the customer.
 * @apiSuccess {String} customer.password  password of the customer.
 */

router.post(
  "/",
  upload.single("profilePicture"),
  asyncMiddleware(async (req, res) => {
    const { name, city, password, email, country, reviewCount } = req.body;
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
      reviewCount,
      profilePicture: profilePicture,
    });

    await customer.save();
    res.status(200).send(customer);
  })
);

/**
 * @api {put} /customer/security/:id update customer passwords
 * @apiName UpdatePassword
 * @apiGroup Customer
 *
 *@apiParam {objectId} id customer unique ID.
 *
 * @apiSuccess {Object[]} customer customerObject
 * @apiSuccess {String} customer.password  password of the customer.
 * @apiSuccess {String} customer.email  email of the customer.
 */

router.put(
  "/security/:id",
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const { password, email } = req.body;

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer && existingCustomer._id.toString() !== id) {
      return res.status(400).send("Email already exists for another customer");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let customer = await Customer.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
        email,
      },
      { new: true }
    );

    if (!customer)
      return res.status(404).send("Customer not found with this id");

    res.status(200).send(customer);
  })
);

/**
 * @api {put} /customer/info/:id update customer info
 * @apiName UpdateCustomer
 * @apiGroup Customer
 *
 *@apiParam {objectId} id customer unique ID.
 *
 * @apiSuccess {Object[]} customer customerObject
 * @apiSuccess {String} customer.name name of the customer.
 * @apiSuccess {String} customer.country country of the customer.*@apiSuccess {String} customer.city city of the customer.
 * @apiSuccess {String} customer.profilePicture  profilePicture of the customer.
 */

router.put(
  "/info/:id",
  upload.single("profilePicture"),
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const { name, city, country } = req.body;
    let profilePicture;

    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      profilePicture = newPath;
    }

    let customer = await Customer.findByIdAndUpdate(
      id,
      {
        name,
        city,
        country,
      },
      { new: true }
    );

    if (!customer)
      return res.status(404).send("Customer not found with this id");

    res.status(200).send(customer);
  })
);

/**
 * @api {delete} /customer/:id Delete customer
 * @apiName DeleteCustomer
 * @apiGroup Customer
 *
 * @apiParam {objectId} id customer unique ID.
 *
 * @apiSuccess {Object[]} customer customer deleted successfully
 */

router.delete(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const post = await Customer.findByIdAndDelete(id);
    if (!post) return res.status(404).send("Customer not found with this id");

    res.status(200).send("Customer deleted successfully");
  })
);

module.exports = router;
