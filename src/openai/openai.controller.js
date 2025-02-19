const openaiService = require("./openai.service");

module.exports = async (req, res) => {
  try {
    const result = await openaiService(req?.file?.path, req?.file.mimetype);
    return res.json({ data: result });
  } catch (error) {
    console.log(error);
  }
};
