const express = require("express");
const Service = require("../models/Service");
const Admin = require("../models/Admin");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });
// const upload = multer({
//   dest: "uploads/",
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10 MB limit
//   },
// });
const router = express.Router();

router.use(express.json());
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

router.post("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, startTime, endTime } = req.body;

  let image;

  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    image = newPath;
  }
  try {
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).send("Admin not Found");

    let service = await Service.findOne({ name });
    if (service) return res.status(400).send("Service already exist");

    // console.log(startTime, name);

    service = new Service({
      name,
      description,
      startTime,
      endTime,
      price,
      admin: admin._id,
      image,
    });

    await service.save();

    res.status(200).send(service);
  } catch (ex) {
    console.log(ex);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
