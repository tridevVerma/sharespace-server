const User = require("../../../models/User");

// CONSTANT STATUS VALUES
const NOT_FREINDS = 0; // default
const REQUESTED = 1;
const PENDING = 2;
const FREINDS = 3;

// Add Freind
module.exports.addFreind = async (req, res) => {
  try {
    //  find logged user and push new Freind to its freinds array
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { freinds: { freind: req.query.userId, status: REQUESTED } } }
    );

    //  find queried user and push new Freind to its freinds array
    // populate it with their freinds
    const newFreind = await User.findOneAndUpdate(
      { _id: req.query.userId },
      { $push: { freinds: { freind: req.user._id, status: PENDING } } },
      { new: true } // returns updated doc
    ).select("email firstname lastname avatar");

    return res.status(200).json({
      success: true,
      data: {
        newFreind, // return newly added freind
        status: REQUESTED, // returns logged user freindship status with newly added freind
      },
      message: "Freind Added !!",
    });
  } catch (err) {
    console.log("Error while adding freind:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Accept Freindship
module.exports.acceptFreind = async (req, res) => {
  try {
    // find logged user
    // find the freind with _id as queried id
    await User.findOneAndUpdate(
      {
        $and: [
          { _id: req.user._id },
          { freinds: { $elemMatch: { freind: req.query.userId } } },
        ],
      },
      { $set: { "freinds.$.status": FREINDS } } // set found freind status of logged user to be 3
    );

    await User.findOneAndUpdate(
      {
        // find queried user
        // find the freind with _id as logged user id
        $and: [
          { _id: req.query.userId },
          { freinds: { $elemMatch: { freind: req.user._id } } },
        ],
      },
      { $set: { "freinds.$.status": FREINDS } } // set found freind status of queried user to be 3
    );

    return res.status(200).json({
      success: true, // return true if operations are successfull
    });
  } catch (err) {
    console.log("Error in accepting freind:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Reject Freindship
module.exports.rejectFreind = async (req, res) => {
  try {
    // find logged user
    await User.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      { $pull: { freinds: { freind: req.query.userId } } } // pull that freind which has freind id equals to queried user id
    );

    // find queried user
    await User.findOneAndUpdate(
      {
        _id: req.query.userId,
      },
      { $pull: { freinds: { freind: req.user._id } } } // pull that freind inside freind's freind list which has id equals to logged user id
    );

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log("Error in rejecting freind:", err);
    return res.status(200).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
