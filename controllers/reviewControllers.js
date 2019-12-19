const Review = require('./../models/reviewModel');
// const APIFeatures = require('../utils/apiFeatures');
// const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handleFactory');
// const AppError = require('../utils/appError');

exports.setTourUserIds = (req, res, next) => {
  /* we separated this one beeacuse of sepration of concerns and to extract uncommon functionality from our code */
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.addNewReview = factory.createOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);
