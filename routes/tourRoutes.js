const express = require('express');

const tourControllers = require('../controllers/tourControllers');
const authControllers = require('../controllers/authControllers');
const reviewRoutes = require('../routes/reviewRoutes');

const router = express.Router();

// router.param('id', tourControllers.checkId);
router.use('/:tourId/reviews', reviewRoutes);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourControllers.getToursWithin);



router
  .route('/top5tours')
  .get(tourControllers.getTopTours, tourControllers.getAllTours);

router.route('/tour-stats').get(tourControllers.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide', 'guide'),
    tourControllers.getMonthlyPlan
  );

router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourControllers.addNewTour
  );

router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourControllers.updateTour
  )
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTour
  );

module.exports = router;
