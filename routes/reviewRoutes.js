const express = require('express');

const authControllers = require('../controllers/authControllers');
const reviewControllers = require('../controllers/reviewControllers');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewControllers.getAllgetAllReviews)
  .post(
    authControllers.protect /* This prevent unlogged user to review */,
    authControllers.restrictTo(
      'user'
    ) /* this is to give only user acces to review */,
    reviewControllers.addNewReview
  );

module.exports = router;
