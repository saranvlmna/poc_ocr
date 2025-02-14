const azurecontroller = require("./computer_vision/visioncontroller");
const router = require("express").Router();
const multer = require("multer");
const inteligencecontroller = require("./doc_inteligence/inteligencecontroller");
const upload = multer({ dest: "uploads/" });

router.post("/vision", upload.single("file"), azurecontroller);
router.post("/inteligence", inteligencecontroller);

module.exports = router;
