const app = require("./app.js")

app.listen(9090, (error) => {
  if (error) {
    console.log("Some problem coming up:", error);
  } else {
    console.log("Server is listening on port 9080...");
  }
});