const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("./dist/traxsmart-assignment"));
app.get("*", function (req, res) {
  res.sendFile("index.html", { root: "./dist/traxsmart-assignment/" });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
