const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    trim: true,
    maxlength: [20, '3-20 charachters'],
    minlength: [3, '3-20 charachters']
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'valid email is required']
  },
  photo: {
    type: String
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'lead-guide', 'guide', 'user'],
      message: 'special functions'
    },
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    trim: true,
    minlength: [8, 'min 8 charachters'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'passwordConfirm is required'],
    trim: true,
    minlength: [8, 'min 8 charachters'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'passwordConfirm and password shpuld be the same'
    }
  },
  passwordChangedAt: {
    type: Date
  },
  passwordResetToken: {
    type: String
  },
  passwordResetTokenExpireTime: {
    type: Date
  }
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  /* we substract 1s to prevent to happen of
   gereneting token before changed time, otherwise our login function don't
   allow that user to enter */
  next();
});

userSchema.methods.comparePass = async function(candidatePass, userPass) {
  return await bcrypt.compare(candidatePass, userPass);
};
userSchema.methods.changedPasswordAfter = async function(JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt / 1000, 10);
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = async function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpireTime = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
