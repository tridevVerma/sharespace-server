const multer = require("multer");
const path = require("path");

const AVATAR_PATH = path.join("/uploads/avatars");
const COVER_PATH = path.join("/uploads/covers");

const avatarStorage = multer.diskStorage({
  // *********** Provide full destination to store avatar images **********
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", AVATAR_PATH));
  },

  // *********** Generate different names for avatar images files **********
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const coverStorage = multer.diskStorage({
  // *********** Provide full destination to store cover images **********
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", COVER_PATH));
  },

  // *********** Generate different names for cover images **********
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

module.exports = {
  AVATAR_PATH,
  avatarStorage,
  COVER_PATH,
  coverStorage,
};
