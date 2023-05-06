const router = require("express").Router();
const postsController = require("../../../controllers/api/v1/postsController");

router.get("/", postsController.getPosts);

module.exports = router;
