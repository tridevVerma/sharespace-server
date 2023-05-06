const router = require("express").Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "Nothing here !!",
  });
});
router.use("/posts", require("./posts.js"));
router.use("/users", require("./users.js"));
router.use("/freindship", require("./freinds.js"));
module.exports = router;
