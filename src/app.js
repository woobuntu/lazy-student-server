const express = require("express");
const config = require("./config");
const router = require("./routes");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const http = require("http");
const https = require("https");
const app = express();

const corsOptions = {
  origin: config.corsOrigin,
  credentials: true,
};

app.use(express.static(__dirname, { dotfiles: "allow" }));
// ssl인증서 받기 위한 임시절차
app.use(bodyParser.json());
app.use("/", cors(corsOptions), router);

const port = config.server.port || 8000;

if (process.env.NODE_ENV === "production") {
  const sslPath = "/home/ubuntu/letsencrypt/config/live/api.lazy-student.co.kr";
  const key = fs.readFileSync(`${sslPath}/privkey.pem`, "utf8").toString();
  const cert = fs.readFileSync(`${sslPath}/fullchain.pem`, "utf8").toString();
  const ca = fs.readFileSync(`${sslPath}/chain.pem`, "utf8").toString();
  https.createServer({ key, cert, ca }, app).listen(port, () => {
    console.log(`🚀 [${process.env.NODE_ENV}] HTTPS Server on Port ${port}`);
  });
  // http.createServer(app).listen(port, () => {
  //   console.log(`API is running on port ${port}`);
  // });
} else {
  http.createServer(app).listen(port, () => {
    console.log(`API is running on port ${port}`);
  });
}
