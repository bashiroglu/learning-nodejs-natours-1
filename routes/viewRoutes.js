const express = require('express');

const viewControllers = require('../controllers/viewControllers');

const router = express.Router();

router.get('/', viewControllers.getOverview);

router.get('/login', viewControllers.getLogin);

router.get('/tour/:slug', viewControllers.getTourDetails);

module.exports = router;
