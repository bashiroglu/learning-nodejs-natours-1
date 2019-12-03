const express = require('express');

const router = express.Router();

const tourControllers = require('../controllers/tourControllers');
router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(tourControllers.addNewTour);

router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);

module.exports = router;
