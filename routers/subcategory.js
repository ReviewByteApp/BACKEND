const asyncMiddleware = require("../middleware/async");
const express = require("express");
const SubCategory = require("../models/SubCategory");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express();

router.use(express.Router());
const upload = multer({ dest: "uploads/" });
router.use(express.json());

router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/**
 * @api {get} /subcategory Request subcategory information
 * @apiName GetsubCategory
 * @apiGroup SubCategory
 *
 *
 * @apiSuccess {Object[]} subcategory subcategoryObject
 * @apiSuccess {String} subcategory.name name of subcategory
 * @apiSuccess {String} subcategory.icon  icon of subcategory
 * @apiSuccess {ObjectId} subcategory.category category ID associated with the category.
 */
router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const subcategory = await SubCategory.find({});

    res.status(200).send(subcategory);
  })
);

/**
 * @api {post} /subcategory Create new Subcategory
 * @apiName CreateSubcategory
 * @apiGroup SubCategory
 *
 *
 * @apiSuccess {Object[]} subcategory subcategoryObject
 * @apiSuccess {String} subcategory.name name of subcategory
 * @apiSuccess {String} subcategory.icon  icon of subcategory
 * @apiSuccess {ObjectId} subcategory.category category ID associated with the category.
 */

router.post(
  "/",
  upload.single("icon"),
  asyncMiddleware(async (req, res) => {
    const { name, category } = req.body;
    let icon;

    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      icon = newPath;
    }

    const subcategory = new SubCategory({ name, icon, category });
    await subcategory.save();

    res.status(200).send(subcategory);
  })
);

/**
 * @api {delete} /subcategory/:id Delete SubCategory
 * @apiName DeleteSubCategory
 * @apiGroup SubCategory
 *
 * @apiParam {objectId} id subcategory unique ID.
 *
 * @apiSuccess {Object[]} subcategory subcategory deleted successfully
 */

router.delete(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const subcategory = await SubCategory.findByIdAndDelete(id);
    if (!subcategory)
      return res.status(404).send("subcategory not found with this id");

    res.status(200).send("SubCategory deleted successfully");
  })
);

module.exports = router;
