const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

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

    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new ErrorResponse("Please provide email/password", 400));
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      next(new ErrorResponse("Email not found!!", 400));
    }

    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      sendToken(user, 200, res);
    } else {
      next(new ErrorResponse("Password is incorrect!", 400));
    }
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = (req, res, next) => {
  res.send("Forgot Password Route");
};

exports.resetPassword = (req, res, next) => {
  res.send("Reset Password Route");
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token });
};
