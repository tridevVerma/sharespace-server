const router = require("express").Router();

// all routes are handled by api
router.use("/api", require("./api"));
module.exports = router;
