const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.status(200);
  res.send({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});

app.get("/health", (req, res) => {
  res.status(200).send({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Task app listening on port: ${port}`);
});
