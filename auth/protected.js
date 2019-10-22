const jwt = require("jsonwebtoken");

const User = require('../models/User');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No token found in request headers." });
  } else {
    jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET,
      (err, decodedToken) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "Unauthorized: Invalid token!" });
        } else {
          req.headers.decodedToken = decodedToken;

          User.findById(decodedToken.id, (err, doc) => {
            if(err || !doc) {
              return res.status(400).json({
                message: "User not found. Please provide a valid user's token."
              });
            } else {
              req.headers.user = doc;
              next();
            }
          })
        }
      }
    );
  }
};
