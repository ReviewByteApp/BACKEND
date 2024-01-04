const asyncMiddleware = require("../middleware/async");
const express = require("express");
const Category = require("../models/Category");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express();

router.use(express.Router());
const upload = multer({ dest: "uploads/" });
router.use(express.json());

router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/**
 * @api {get} /category Request category information
 * @apiName GetCategory
 * @apiGroup Category
 *
 *
 * @apiSuccess {Object[]} category categoryObject
 * @apiSuccess {String} category.name name of category
 * @apiSuccess {String} category.icon  icon of category
 */
router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const category = await Category.find({});

    res.status(200).send(category);
  })
);

/**
 * @api {get} /category Request category information
 * @apiName GetCategory
 * @apiGroup Category
 *
 *
 * @apiSuccess {Object[]} category categoryObject
 * @apiSuccess {String} category.name name of category
 * @apiSuccess {String} category.icon  icon of category
 */

router.post(
  "/",
  upload.single("icon"),
  asyncMiddleware(async (req, res) => {
    const { name } = req.body;
    let icon;

    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      icon = newPath;
    }

    const category = new Category({ name, icon });
    await category.save();

    res.status(200).send(category);
  })
);

/**
 * @api {delete} /category/:id Delete Category
 * @apiName DeleteCategory
 * @apiGroup Category
 *
 * @apiParam {objectId} id category unique ID.
 *
 * @apiSuccess {Object[]} category category deleted successfully
 */

router.delete(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category)
      return res.status(404).send("category not found with this id");

    res.status(200).send("Category deleted successfully");
  })
);

module.exports = router;
