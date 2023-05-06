const mongoose = require("mongoose");
const multer = require("multer");
const {
  AVATAR_PATH,
  avatarStorage,
  COVER_PATH,
  coverStorage,
} = require("../config/multer");

// *********** Relative path to upload folder which will store avatars **********

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },
    phone: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    dob: {
      type: Date,
    },
    avatar: {
      type: String,
    },
    cover: {
      type: String,
    },
    lockProfile: {
      type: Boolean,
      default: false,
    },
    freinds: [
      {
        freind: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          unique: true,
        },
        status: {
          type: Number,
          enum: [
            0, // NOT_FREINDS --> default
            1, // REQUESTED
            2, // PENDING
            3, // FREINDS
          ],
        },
      },
    ],
    story: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "onStory",
      },
    ],

    onStory: {
      type: String,
      enum: ["Image", "Video"],
    },
  },

  {
    timestamps: true,
  }
);

// static methods in mongoose
userSchema.statics.uploadedAvatar = multer({ storage: avatarStorage }).single(
  "avatar"
);

userSchema.statics.uploadedCover = multer({ storage: coverStorage }).single(
  "cover"
);

// static variables in mongoose
userSchema.statics.avatarPath = AVATAR_PATH;
userSchema.statics.coverPath = COVER_PATH;

const User = mongoose.model("User", userSchema);
module.exports = User;
