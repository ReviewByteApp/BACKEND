const asyncMiddleware = require("../middleware/async");
const express = require("express");
const bcrypt = require("bcrypt");
// const Admin = require("../models/Admin");
const Admin = require("../models/Admin");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const upload = multer({ dest: "uploads/" });
router.use(express.json());

router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/**
 * @api {get} /admin Request Admin information
 * @apiName GetAdmin
 * @apiGroup Admin
 *
 *
 * @apiSuccess {Object[]} admin adminObject
 * @apiSuccess {String} admin.name  name of the admin.
 * @apiSuccess {String} admin.password  password of the admin.
 * @apiSuccess {String} admin.email  email of the admin.
 * @apiSuccess {String} admin.country  country of the admin.
 * @apiSuccess {String} admin.city  city of the admin.
 * @apiSuccess {String} admin.map  map of the admin.
 * @apiSuccess {String} description Description of the Admin.
 * @apiSuccess {String} website Admin's website URL.
 * @apiSuccess {ObjectId} admin.category Category ID associated with the Admin.
 * @apiSuccess {ObjectId} admin.subcategory Subcategory ID associated with the Admin.
 * @apiSuccess {String} admin.profilePicture  profilePicture of the admin.
 * @apiSuccess {String[]} admin.images Array of image URLs
 * @apiSuccess {Number} admin.reviewCount Number of reviews for the Admin.
 * @apiSuccess {Number} admin.reviewScore Review score for the Admin.
 * @apiSuccess {String[]} admin.phone Array of phone numbers associated with the Admin.
 * * @apiSuccess {String[]} services Array of services
 * @apiSuccess {Date} admin.createdAt Timestamp when the Admin was created.
 * @apiSuccess {Date} admin.updatedAt Timestamp when the Admin was last updated (default is null for initial creation).
 * @apiSuccess {String} admin.video  video of the admin.
 */

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const admins = await Admin.find({});
    // .select("-password")
    res.status(200).send(admins);
  })
);

/**
 * @api {post} /admin create new admin
 * @apiName CreateAdmin
 * @apiGroup Admin
 *
 *
 * @apiSuccess {Object[]} admin adminObject
 * @apiSuccess {String} admin.name  name of the admin.
 * @apiSuccess {String} admin.password  password of the admin.
 * @apiSuccess {String} admin.email  email of the admin.
 * @apiSuccess {String} admin.country  country of the admin.
 * @apiSuccess {String} admin.city  city of the admin.
 * @apiSuccess {String} admin.map  map of the admin.
 * @apiSuccess {String} description Description of the Admin.
 * @apiSuccess {String} website Admin's website URL.
 * @apiSuccess {ObjectId} admin.category Category ID associated with the Admin.
 * @apiSuccess {ObjectId} admin.subcategory Subcategory ID associated with the Admin.
 * @apiSuccess {String} admin.profilePicture  profilePicture of the admin.
 * @apiSuccess {String[]} admin.images Array of image URLs
 * @apiSuccess {Number} admin.reviewCount Number of reviews for the Admin.
 * @apiSuccess {Number} admin.reviewScore Review score for the Admin.
 * @apiSuccess {String[]} admin.phone Array of phone numbers associated with the Admin.
 * @apiSuccess {String[]} services Array of services
 * @apiSuccess {Date} admin.createdAt Timestamp when the Admin was created.
 * @apiSuccess {Date} admin.updatedAt Timestamp when the Admin was last updated (default is null for initial creation).
 * @apiSuccess {String} admin.video  video of the admin.
 */

router.post(
  "/",
  upload.fields([
    { name: "profilePicture" },
    { name: "images" },
    { name: "video" },
  ]),

  asyncMiddleware(async (req, res) => {
    const {
      name,
      password,
      email,
      category,
      country,
      city,
      map,
      subCategory,
      description,
      reviewCount,
      reviewScore,
      services,
      website,
      phone,
    } = req.body;
    let profilePicture;
    let imagePaths = [];
    let videoPath;

    // Handle profile picture upload
    if (req.files && req.files.profilePicture) {
      const { originalname, path } = req.files.profilePicture[0];
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      profilePicture = newPath;
    }

    // Handle image file upload
    if (req.files && req.files.images) {
      req.files.images.forEach((file) => {
        const { originalname, path } = file;
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newPath = path + "." + ext;
        fs.renameSync(path, newPath);
        imagePaths.push(newPath);
      });
    }

    // Handle video file upload
    if (req.files && req.files.video) {
      const { originalname, path } = req.files.video[0];
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      videoPath = newPath;
    }

    let admin = await Admin.findOne({ email });
    if (admin) return res.status(400).send("Email already exist");
    const hashedPassword = await bcrypt.hash(password, 10);
    admin = new Admin({
      password: hashedPassword,
      name,
      email,
      category,
      country,
      city,
      map,
      subCategory,
      description,
      reviewCount,
      reviewScore,
      services,
      website,
      phone,
      profilePicture: profilePicture,
      images: imagePaths,
      video: videoPath,
    });

    await admin.save();

    admin = await Admin.findById(admin._id);

    res.status(200).send(admin);
  })
);

/**
 * @api {put} /admin/profile/:id update admin profile
 * @apiName UpdateProfile
 * @apiGroup Admin
 *
 *@apiParam {objectId} id admin unique ID.
 *
 * @apiSuccess {Object[]} admin adminObject
 * @apiSuccess {String} admin.name  name of the admin.
 * @apiSuccess {String} admin.profilePicture  profilePicture of the admin.
 */

router.put(
  "/profile/:id",
  upload.single("profilePicture"),
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    let profilePicture;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      profilePicture = newPath;
    }

    let admin = await Admin.findByIdAndUpdate(
      id,
      {
        name,
        profilePicture,
      },
      { new: true }
    );

    if (!admin) return res.status(404).send("Admin not fund with this id");

    res.status(200).send(admin);
  })
);

/**
 * @api {put} /admin/info/:id update admin information
 * @apiName UpdateInformation
 * @apiGroup Admin
 *
 *@apiParam {objectId} id admin unique ID.
 *
 * @apiSuccess {Object[]} admin adminObject
 * @apiSuccess {String} admin.country  country of the admin.
 * @apiSuccess {String} admin.city  city of the admin.
 * @apiSuccess {String} admin.map  map of the admin.
 * @apiSuccess {String} admin.description Description of the Admin.
 * @apiSuccess {String[]} admin.phone Array of phone numbers associated with the Admin.
 * @apiSuccess {String[]} admin.services Array of services
 * @apiSuccess {ObjectId} admin.category Category ID associated with the Admin.
 * @apiSuccess {ObjectId} admin.subcategory Subcategory ID associated with the Admin.
 * @apiSuccess {String} website Admin's website URL.
 */

router.put(
  "/info/:id",
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const {
      country,
      city,
      description,
      services,
      website,
      phone,
      map,
      category,
      subcategory,
    } = req.body;

    let admin = await Admin.findByIdAndUpdate(
      id,
      {
        country,
        city,
        description,
        services,
        website,
        phone,
        map,
        category,
        subcategory,
      },
      { new: true }
    );

    if (!admin) return res.status(404).send("Admin not fund with this id");

    res.status(200).send(admin);
  })
);

/**
 * @api {put} /admin/security/:id update admin passwords
 * @apiName UpdatePassword
 * @apiGroup Admin
 *
 *@apiParam {objectId} id admin unique ID.
 *
 * @apiSuccess {Object[]} admin adminObject
 * @apiSuccess {String} admin.password  password of the admin.
 * @apiSuccess {String} admin.email  email of the admin.
 */

router.put(
  "/security/:id",
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const { password, email } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin && existingAdmin._id.toString() !== id) {
      return res.status(400).send("Email already exists for another Admin");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let admin = await Admin.findByIdAndUpdate(id, {
      password: hashedPassword,
      email,
    });

    if (!admin) return res.status(404).send("Admin not found with this id");

    res.status(200).send(admin);
  })
);

/**
 * @api {put} /admin/file/:id update admin uploadFiles
 * @apiName UpdateuploadFiles
 * @apiGroup Admin
 *
 *@apiParam {objectId} id admin unique ID.
 *
 * @apiSuccess {Object[]} admin adminObject
 * @apiSuccess {String[]} admin.images Array of image URLs
 * @apiSuccess {String} admin.video  video of the admin.
 */

router.put(
  "/file/:id",
  upload.fields([{ name: "images" }, { name: "video" }]),
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    let imagePaths = [];
    let videoPath;

    if (req.files && req.files.images) {
      req.files.images.forEach((file) => {
        const { originalname, path } = file;
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newPath = path + "." + ext;
        fs.renameSync(path, newPath);
        imagePaths.push(newPath);
      });
    }

    // Handle video file upload
    if (req.files && req.files.video) {
      const { originalname, path } = req.files.video[0];
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      videoPath = newPath;
    }

    let admin = await Admin.findByIdAndUpdate(
      id,
      {
        images: imagePaths,
        video: videoPath,
      },
      { new: true }
    );

    if (!admin) return res.status(404).send("Admin not fund with this id");

    res.status(200).send(admin);
  })
);

/**
 * @api {delete} /admin/:id Delete admin
 * @apiName DeleteAdmin
 * @apiGroup Admin
 *
 * @apiParam {objectId} id admin unique ID.
 *
 * @apiSuccess {Object[]} admin admin deleted successfully
 */

router.delete(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;

    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) return res.status(404).send("Admin not found with this id");

    res.status(200).send("Admin deleted successfully");
  })
);

module.exports = router;
