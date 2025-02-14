const inteligenceservice = require("./inteligenceservice");

module.exports = async (req, res) => {
  try {
    const result = await inteligenceservice();
    return res.json({ data: result });
  } catch (error) {
    console.log(error);
  }
};
