const router = require("express").Router();
const usersController = require("../../../controllers/api/v1/usersController");
const verifyUser = require("../../../config/verifyUser");

router.post("/signin", usersController.signin);
router.post("/signup", usersController.signup);

// Edit Profile, Upload Images, Lock / Unlock Profile
router.post("/edit", verifyUser, usersController.editProfile);
router.post("/upload-cover", verifyUser, usersController.uploadCoverImage);
router.post("/upload-avatar", verifyUser, usersController.uploadAvatarImage);
router.get(
  "/toggle-profile-status",
  verifyUser,
  usersController.toggleProfileStatus
);

router.get("/all", usersController.allUsers);
router.get("/info", verifyUser, usersController.getProfile);
module.exports = router;
