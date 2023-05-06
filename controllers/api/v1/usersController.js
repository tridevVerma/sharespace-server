const jwt = require("jsonwebtoken");
const User = require("../../../models/User");
const env = require("../../../config/environment");
const path = require("path");
const fs = require("fs");

module.exports.signin = async (req, res) => {
  try {
    // get user by email and populate their freinds
    const user = await User.findOne({ email: req.body.email }).populate({
      path: "freinds.freind",
      model: "User",
      select: "email firstname lastname avatar",
    });

    // if user not found or password doesn't match return
    if (!user || user.password !== req.body.password) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password !!",
      });
    }

    const { password, ...userData } = user.toObject();

    // send logged user data with jwt-token --> will expired after 1 hr
    return res.status(200).json({
      success: true,
      data: {
        token: jwt.sign(userData, env.jwt_key, {
          expiresIn: 60 * 60,
        }),
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.signup = async (req, res) => {
  try {
    // create new user
    const user = await User.create(req.body);
    return res.status(200).json({
      message: "new user created",
      success: true,
      data: {
        firsname: user.firstname,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.editProfile = async (req, res) => {
  try {
    // get user data (exclude password)
    const updates = { ...req.body };
    const user = await User.findOne()
      .where("_id")
      .equals(req.user._id)
      .select("-password");

    if (user) {
      // if user exists execute all edits/changes passed in request
      for (let field in updates) {
        user.set(field, updates[field]);
      }
      await user.save();

      // return modified logged user with new jwt-key
      return res.status(200).json({
        success: true,
        data: {
          updatedToken: jwt.sign(user.toObject(), env.jwt_key, {
            expiresIn: 60 * 60,
          }),
        },
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User don't exist !!",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports.uploadCoverImage = (req, res) => {
  try {
    // save cover image with multer
    User.uploadedCover(req, res, async function (err) {
      if (err) {
        console.log("****Multer Error****", err);
        return;
      }

      // find logged user
      const user = await User.findOne().where("_id").equals(req.user._id);

      if (user) {
        if (req.file) {
          // if user already has cover photo
          if (user.cover) {
            const coverfilePath = path.join(__dirname, "../../../", user.cover);

            if (fs.existsSync(coverfilePath)) {
              // delete cover if already exist
              fs.unlinkSync(coverfilePath);
            }
          }
          // this is the path of the uploaded file into the cover field in the user
          user.cover = path.join(User.coverPath, req.file.filename);
          user.save();
        }
        // return only path of uploaded cover image
        return res.status(200).json({
          success: true,
          data: {
            uploadedPath: user.cover,
          },
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "User not found !!",
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.uploadAvatarImage = (req, res) => {
  try {
    // save avatar image with multer
    User.uploadedAvatar(req, res, async function (err) {
      if (err) {
        console.log("****Multer Error****", err);
        return;
      }

      // find logged user
      const user = await User.findOne().where("_id").equals(req.user._id);

      if (user) {
        if (req.file) {
          // if user already has avatar photo
          if (user.avatar) {
            const avatarFilePath = path.join(
              __dirname,
              "../../../",
              user.avatar
            );

            if (fs.existsSync(avatarFilePath)) {
              // delete avatar if already exist
              fs.unlinkSync(avatarFilePath);
            }
          }
          // this is the path of the uploaded file into the avatar field in the user
          user.avatar = path.join(User.avatarPath, req.file.filename);
          user.save();
        }
        // return only path of uploaded avatar image
        return res.status(200).json({
          success: true,
          data: {
            uploadedPath: user.avatar,
          },
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "User not found !!",
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports.toggleProfileStatus = async (req, res) => {
  try {
    // find logged user
    const user = await User.findOne({ _id: req.user._id });

    // toggle profile-lock status
    user.lockProfile = !user.lockProfile;
    await user.save();
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.getProfile = async (req, res) => {
  try {
    // find user by query (exclude password) and populate their freinds
    const user = await User.findOne({ _id: req.query.userId })
      .populate({
        path: "freinds.freind",
        model: "User",
        select: "email firstname lastname avatar",
      })
      .select("-password");

    if (user) {
      // if user found return the profile data
      return res.status(200).json({
        success: true,
        data: {
          profileData: user,
        },
      });
    }
    return res.status(404).json({
      success: false,
      message: "User not found !!",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports.allUsers = async (req, res) => {
  // find all users --> get only (email, firstname, lastname, avatar)
  // does'nt require authentication
  const allUsers = await User.find(
    {},
    { email: 1, firstname: 1, lastname: 1, avatar: 1 }
  );

  return res.status(200).json({
    success: true,
    data: {
      allUsers,
    },
  });
};
