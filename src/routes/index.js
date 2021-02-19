const { Router } = require("express");
const translate = require("./translate");
const auth = require("./auth");
const news = require("./news");
const config = require("../config");
const cors = require("cors");

const router = Router();

const corsOptions = {
  origin: config.corsOrigin,
  credentials: true
};

router.get("/", cors(corsOptions), (req, res) => {
  res.send("서버 켜져쓰요");
});
router.use("/translate", cors(corsOptions), translate);
router.use("/auth", cors(corsOptions), auth);
router.use("/news", cors(corsOptions), news);

module.exports = router;
