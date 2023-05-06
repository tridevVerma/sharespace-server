const verifyUser = require("../../../config/verifyUser");
const router = require("express").Router();

const {
  addFreind,
  acceptFreind,
  rejectFreind,
} = require("../../../controllers/api/v1/freindshipsController");

router.get("/create-freindship", verifyUser, addFreind);
router.get("/accept-freindship", verifyUser, acceptFreind);
router.get("/reject-freindship", verifyUser, rejectFreind);

module.exports = router;
