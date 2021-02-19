const { Router } = require("express");
const config = require("../config");
const cors = require("cors");

const router = Router();

const { translate } = require("../utils/translate");

const corsOptions = {
  origin: config.corsOrigin,
  credentials: true
};

router.post("/", cors(corsOptions), translate);

module.exports = router;
