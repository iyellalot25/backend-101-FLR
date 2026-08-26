const app = require("./src/app");

const port = 3000;

app.listen(port, () => {
  console.log(`Task app listening on port: ${port}`);
});
