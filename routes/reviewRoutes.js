const express = require('express');

const authControllers = require('../controllers/authControllers');
const reviewControllers = require('../controllers/reviewControllers');

const router = express.Router({ mergeParams: true });

router.use(authControllers.protect);
router
  .route('/')
  .get(reviewControllers.getAllReviews)
  .post(
    authControllers.restrictTo(
      'user'
    ) /* this is to give only user acces to review */,
    reviewControllers.setTourUserIds,
    reviewControllers.addNewReview
  );
router
  .route('/:id')
  .get(reviewControllers.getReview)
  .patch(reviewControllers.updateReview)
  .delete(reviewControllers.deleteReview);

module.exports = router;
