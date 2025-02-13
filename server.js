const express = require("express");
require("dotenv").config();
const azureRouter = require("./src/computer_vision/router");
const app = express();
const port = 4578;

app.use(express.json());
app.use("/azure", azureRouter);

app.get("/", (req, res) => {
  res.send("Hey server!");
});

app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
