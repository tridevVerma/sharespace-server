const express = require("express");
const path = require("path");
require("./config/mongoose");
const app = express();
const PORT = require("./config/environment").server_port;
const cors = require("cors");

app.use(cors()); // to enable cross origin support across requests
app.use(express.urlencoded({ extended: true })); // body parser to parse the urlencoded payloads
app.use(express.json()); // parse the request with json payloads
app.use("/uploads", express.static(path.join(__dirname, "/uploads"))); // make the upload path available to the browser

app.use("/", require("./routes")); // send all routing to routes folder

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error in starting express server:", err);
    return;
  }
  console.log("Successfully started express server at port:", PORT);
});
