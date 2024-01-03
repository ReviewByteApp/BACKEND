const asyncMiddleware = require("../middleware/async");
const express = require("express");
const Category = require("../models/Category");

const router = express();

router.use(express.Router());

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { name, icon } = req.body;

    const category = new Category({ name, icon });
    await category.save();

    res.status(200).send(category);
  })
);

module.exports = router;
