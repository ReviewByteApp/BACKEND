const asyncMiddleware = require("../middleware/async");
const express = require("express");
const Review = require("../models/Review");

const router = express.Router();
router.use(express.json());

/**
 * @api {get} /review Request review information
 * @apiName GetReview
 * @apiGroup Review
 *
 *
 * @apiSuccess {Object[]} review reviewObject
 * @apiSuccess {String} review.title  title of the review.
 * @apiSuccess {String} review.description  description about review.
 * @apiSuccess {Number} review.like  like about review.
 *  @apiSuccess {Number} review.rate  rate about review.
 * @apiSuccess {Date} review.date Date of review
 * @apiSuccess {Date} review.createdAt Timestamp when the Review was created.
 * @apiSuccess {Date} review.updatedAt Timestamp when the Review was last updated (default is null for initial creation).
 * @apiSuccess {ObjectId} review.admin admin ID associated with the review.
 * @apiSuccess {ObjectId} review.customer customer ID associated with the review.
 */

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const review = await Review.find({});
    res.status(200).send(review);
  })
);

/**
 * @api {post} /post Create new review
 * @apiName CreateReview
 * @apiGroup Review
 *
 *
 * @apiSuccess {Object[]} review reviewObject
 * @apiSuccess {String} review.title  title of the review.
 * @apiSuccess {String} review.description  description about review.
 * @apiSuccess {Number} review.like  like about review.
 *  @apiSuccess {Number} review.rate  rate about review.
 * @apiSuccess {Date} review.date Date of review
 * @apiSuccess {Date} review.createdAt Timestamp when the Review was created.
 * @apiSuccess {Date} review.updatedAt Timestamp when the Review was last updated (default is null for initial creation).
 * @apiSuccess {ObjectId} review.admin admin ID associated with the review.
 * @apiSuccess {ObjectId} review.customer customer ID associated with the review.
 */

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { title, date, description, rate, like, customer, admin } = req.body;

    const review = new Review({
      title,
      date,
      description,
      rate,
      like,
      customer,
      admin,
    });

    await review.save();
    res.status(200).send(review);
  })
);

/**
 * @api {delete} /review/:id Delete review
 * @apiName DeleteReview
 * @apiGroup Review
 *
 * @apiParam {objectId} id review unique ID.
 *
 * @apiSuccess {Object[]} review review deleted successfully
 */

router.delete(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);
    if (!review) return res.status(404).send("Review not found with this id");

    res.status(200).send("Review deleted successfully");
  })
);

module.exports = router;
