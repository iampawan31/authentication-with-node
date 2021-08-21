const User = require("../models/User");

exports.register = async (req, res, next) => {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password,
    });
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, error: "Please provide email/password" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(400).json({
        success: false,
        error: "Email not found!!",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      res.status(200).json({ success: true, user });
    } else {
      res.status(404).json({ success: false, error: "Password is incorrect!" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.forgotPassword = (req, res, next) => {
  res.send("Forgot Password Route");
};

exports.resetPassword = (req, res, next) => {
  res.send("Reset Password Route");
};
