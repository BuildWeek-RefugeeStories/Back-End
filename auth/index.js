const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Users = require("../data/users");

const router = express.Router();

router.post("/register", async (req, res) => {
  if (
    req.body.email &&
    req.body.email.trim() &&
    req.body.firstName &&
    req.body.firstName.trim() &&
    req.body.lastName &&
    req.body.lastName.trim() &&
    req.body.password &&
    req.body.password.trim()
  ) {
    const user = await Users.findByEmail(req.body.email);
    if (user.email === req.body.email) {
      res.status(401).json({
        message:
          "The email you've provided is already in use by another account"
      });
    } else {
      const info = {
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 15),
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        country: req.body.country ? req.body.country : ""
      };

      const user = await Users.register(info);

      // Assign a token to the response object
      user.token = generateToken(user);

      delete user.password;

      res.status(201).json(user);
    }
  } else {
    res.status(400).json({
      message:
        "Please provide a valid email, password, first and last name. Specifying your country is optional."
    });
  }
});

router.post("/login", async (req, res) => {
  if (
    req.body.email &&
    req.body.email.trim() !== "" &&
    req.body.password &&
    req.body.password.trim() !== ""
  ) {
    const user = await Users.findByEmail(req.body.email);

    if (!user.email) {
      return res.status(404).json({
        message:
          "No user with that email address exists, please check your credentials."
      });
    } else {
      if (bcrypt.compareSync(req.body.password, user.password)) {

        // Add a token property to the response object
        user.token = generateToken(user);

        delete user.password;

        return res.status(200).json(user);
      } else {
        return res
          .status(401)
          .json({ message: "Incorrect password. Try again." });
      }
    }
  } else {
    return res
      .status(400)
      .json({ message: "Please provide an email and a password to log in." });
  }
});

const generateToken = user => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_SECRET
  );
}

module.exports = router;
