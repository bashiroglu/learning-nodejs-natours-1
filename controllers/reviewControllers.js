const Review = require('./../models/reviewModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handleFactory');
// const AppError = require('../utils/appError');

exports.getAllgetAllReviews = catchAsync(async (req, res, next) => {
  let filter = {}; /* we create filter */
  if (!req.params.tourId)
    filter = {
      tour: req.params.tourId
    }; /* we update filter to send this object to find query and to get only reviews are owned that tour */

  const features = new APIFeatures(Review.find(filter), req.query);
  const reviews = await features.query;
  //send response
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});
exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.addNewReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);
