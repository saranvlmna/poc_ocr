const intelligenceservice = require("./intelligenceservice");

module.exports = async (req, res) => {
  try {
    const result = await intelligenceservice();
    return res.json({ data: result });
  } catch (error) {
    console.log(error);
  }
};
