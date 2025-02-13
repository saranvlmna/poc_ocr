const azureservice = require("./visionservice");

module.exports = async (req, res) => {
  try {
    const result = await azureservice(req.file.path);
    return res.json({ data: result });
  } catch (error) {
    console.log(error);
  }
};
