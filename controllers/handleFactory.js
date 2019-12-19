const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with this Id', 404));
    }
    res.status(204).json({
      status: 'success',
      data: {
        data: null
      }
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(new AppError('No document found with this Id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newDoc
      }
    });
  });
exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions)
      query = Model.findById(req.params.id).populate(populateOptions);
    /* populatefunctionality makes this different that is why we use above implementation to give some kind of option to function */
    const doc = await query;
    if (!doc) {
      return next(new AppError('No document found with this Id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });
exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // to allow to get review with this filter
    let filter = {}; /* we create filter */
    if (req.params.tourId)
      filter = {
        tour: req.params.tourId
      }; /* we update filter to send this object to find query and to get only reviews are owned that tour */

    const features = new APIFeatures(
      Model.find(filter),
      req.query
    ) /* if we don't have filter which it can be because of if */
      /* any way this filter will work if we need, like we may need in reviews */
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const docs = await features.query;
    const docs = await features.query.explain(); /* this give statistics about quering */

    //send response
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        docs
      }
    });
  });
