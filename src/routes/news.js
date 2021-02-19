const { Router } = require("express");
const config = require("../config");
const cors = require("cors");

const router = Router();

const { getNews, getPrivateNews, updatePost } = require("../utils/news");
const post = require("../utils/news/post");

const { requireSignin } = require("../utils/auth");

const corsOptions = {
  origin: config.corsOrigin,
  credentials: true,
};

router.get("/", cors(corsOptions), getNews);
router.get("/logined", cors(corsOptions), requireSignin, getPrivateNews);
router.post("/post", cors(corsOptions), requireSignin, post);
router.post("/update-post", cors(corsOptions), requireSignin, updatePost);

module.exports = router;
