const express = require('express');

const viewControllers = require('../controllers/viewControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

router.get('/', viewControllers.getOverview);

router.get('/login', viewControllers.getLogin);

router.get(
  '/tour/:slug',
  authControllers.protect,
  viewControllers.getTourDetails
);

module.exports = router;
