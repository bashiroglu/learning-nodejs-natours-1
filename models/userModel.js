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
  }
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePass = async function(candidatePass, userPass) {
  return await bcrypt.compare(candidatePass, userPass);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
