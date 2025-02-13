const azurecontroller = require("./visioncontroller");

const router = require("express").Router();

router.get("/", azurecontroller);

module.exports = router;
