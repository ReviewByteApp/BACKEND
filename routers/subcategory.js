const asyncMiddleware = require("../middleware/async");
const express = require("express");
const SubCategory = require("../models/SubCategory");
const router = express();

router.use(express.Router());

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { name, icon, category } = req.body;

    const subcategory = new SubCategory({ name, icon, category });
    await subcategory.save();

    res.status(200).send(subcategory);
  })
);

module.exports = router;
