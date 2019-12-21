const Tour = require('./../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All tours',
    tours
  });
});

exports.getTourDetails = (req, res) => {
  res.status(200).render('tour', {
    title: 'tour'
  });
};
