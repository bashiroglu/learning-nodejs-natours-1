const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('./../utils/email');

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from response
  user.password = undefined;

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
    passwordChangedAt: req.body.passwordChangedAt
    /* role: req.body.role  this shouldn't be here because user can not make himself admin*/
  });

  const url = `${req.protocol}://${req.get('host')}/me`;
  // const url = `http://localhost:3000/me`;
  /* we use sendwelcome function in email class to welcome who signed up */
  await new Email(newUser, url).sendWelcome();

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
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
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
  res.locals.user = freshUser; /* we also need this one in get me page */
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  /* we had to change this function to local error handling by using try catch block
   because while loggin out this function check the jwt and cannot promisfy, and throw error
  so this is not something we want that is why we
   didin't use asycn catch, as a result this function coun't thre global error */
  if (req.cookies.jwt) {
    // 1) we verify token here
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check whether user still exists or not
      const freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        return next();
      }

      // 3) we check whether user changed password after the token was issued
      if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next();
      } /* I should watch this part again */

      // it means we have user and we send it via locals to all pug files
      res.locals.user = freshUser;
      return next();
    } catch (error) {
      return next();
    }
  }
  next();
};
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`you don't have permission from restrict to`, 403)
      );
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

  try {
    // const resetURL = `http://localhost:3000/api/v1/users/resetPassword/${resetToken}`;
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    /* we use sendPasswordReset function in email class to send token who forget his or her token*/
    await new Email(user, resetURL).sendPasswordReset();

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
