const asyncMiddleware = require("../middleware/async");
const express = require("express");
const Review = require("../models/Review");

const router = express.Router();
router.use(express.json());

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { title, date, description, rate, usefulCount, customer, admin } =
      req.body;

    const review = new Review({
      title,
      date,
      description,
      rate,
      usefulCount,
      customer,
      admin,
    });

    await review.save();
    res.status(200).send(review);
  })
);

module.exports = router;
