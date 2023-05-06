const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(501).json({
    message: "Site under construction try version 1",
  });
});

module.exports = router;
