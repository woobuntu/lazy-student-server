const { Router } = require("express");
const config = require("../config");
const cors = require("cors");

const router = Router();

const { kakaoLogin } = require("../utils/auth");

const corsOptions = {
  origin: config.corsOrigin,
  credentials: true
};

router.post("/", cors(corsOptions), kakaoLogin);

module.exports = router;
