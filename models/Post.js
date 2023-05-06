const mongoose = require("mongoose");
const multer = require("multer");

const {
  IMAGE_PATH,
  imageStorage,
  VIDEO_PATH,
  videoStorage,
} = require("../config/multer");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    mediaPath: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video", "text"],
      required: true,
    },
    desc: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like",
      },
    ],
  },
  {
    timestamps: true,
  }
);

postSchema.statics.uploadedImage = multer({ storage: imageStorage }).single(
  "images"
);

postSchema.statics.uploadedVideo = multer({ storage: videoStorage }).single(
  "videos"
);

postSchema.statics.imagePath = IMAGE_PATH;
postSchema.statics.videosPath = VIDEO_PATH;

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
