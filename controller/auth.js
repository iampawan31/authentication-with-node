require("dotenv").config();
const crypto = require("crypto");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");

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

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("Email does not exist!!", 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `${process.env.FRONT_END_URL}/reset-password/${resetToken}`;

    const message = `
    <h1>Dear ${user.firstName}</h1>
    <p>You have requested for password reset.</p>
    <p>Please go the below link to reset your password</p>
    <a href="${resetUrl}" target="_blank" clicktracking="off">Click here to reset your password</a>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Reset Password",
        text: message,
      });

      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be sent!!", 500));
    }
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Reset Token!!", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res
      .status(201)
      .json({ success: true, data: "Password reset success" });
  } catch (error) {
    next(error);
  }
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token });
};
