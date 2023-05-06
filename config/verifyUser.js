const jwt = require("jsonwebtoken");

const env = require("./environment");

const verifyUser = (req, res, next) => {
  let token;

  // check if header contain authorization token
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  // unauthorized access if token is not present
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access !!",
    });
  }
  try {
    // decode token and save user data to request parameter
    const decoded = jwt.verify(token, env.jwt_key);
    req.user = decoded;
  } catch (err) {
    // can't decode token implies token expired or altered
    return res
      .status(400)
      .json({ success: false, message: "Token Expired, Login Again!!" });
  }
  return next();
};

module.exports = verifyUser;
