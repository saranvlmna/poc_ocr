const azurecontroller = require("./visioncontroller");
const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/vision", upload.single("file"), azurecontroller);

module.exports = router;
