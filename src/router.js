const azurecontroller = require("./computer_vision/visioncontroller");
const router = require("express").Router();
const multer = require("multer");
const intelligencecontroller = require("./doc_intelligence/intelligencecontroller");
const openaiController = require("./openai/openai.controller");
const upload = multer({ dest: "uploads/" });

router.post("/vision", upload.single("file"), azurecontroller);
router.post("/intelligence", upload.single("file"), intelligencecontroller);
router.post("/openai", upload.single("file"), openaiController);
module.exports = router;
