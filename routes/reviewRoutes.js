const express = require('express');

const reviewControllers = require('../controllers/reviewControllers');

const router = express.Router();

router
  .route('/')
  .get(reviewControllers.getAllgetAllReviews)
  .post(reviewControllers.addNewReview);

module.exports = router;
