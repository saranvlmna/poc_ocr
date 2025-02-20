const openaiImage = require("./openai.image");
const openaiPdf = require("./openai.pdf");

module.exports = async (req, res) => {
  try {
    const { fileUrl, fileType } = req.body;
    let result;

    if (fileType === "image") result = await openaiImage(fileUrl);
    if (fileType === "pdf") result = await openaiPdf(fileUrl);

    return res.json({ data: result });
  } catch (error) {
    console.log(error);
  }
};
