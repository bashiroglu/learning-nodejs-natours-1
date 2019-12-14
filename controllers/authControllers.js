const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  });
  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('please email and pass', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePass(password, user.password))) {
    return next(new AppError('incorrect email and pass', 401));
  }
  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('authorization', 401));
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('this user is not longer available', 401));
  }
  const isFreshUser = await freshUser.changedPasswordAfter(decoded.iat);
  if (isFreshUser) {
    return next(
      new AppError('user recently changed password, please login again', 401)
    );
  }
  //grant access
  req.user = freshUser;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`you don't have permission`, 403));
    }
    next();
  };
};
exports.forgetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user's email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(`no user with that email`, 404));
  }
  // 2) Generate random resetToken
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Generate resetURL and message
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n Otherwise, ignore this email!`;
  // 4) Send it to user's email by using send to funtion

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpireTime = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error with email process.'), 500);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // encrypt token which comes from req.params
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  // bring user from db by using hashedToken and checking time
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpireTime: { $gt: Date.now() }
  });
  // if we couldn't bring user  we throw error
  if (!user) {
    return next(new AppError('token is invalid or expired'), 400);
  }
  // we take detail from req.body and save to db
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpireTime = undefined;

  await user.save(); // we use save because we need middleware functions

  //and we give signin token to the user
  createAndSendToken(user, 200, res);
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.comparePass(req.body.currentPassword, user.password))) {
    return next(new AppError('Do not know your password?.', 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createAndSendToken(user, 200, res);
});
