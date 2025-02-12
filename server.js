const express = require("express");
const app = express();
const port = 4578;

app.get("/", (req, res) => {
  res.send("hey server!");
});

app.listen(4578, () => {
  console.log(`server listening at ${port}`);
});
