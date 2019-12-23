const express = require('express');

const viewControllers = require('../controllers/viewControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

router.use(authControllers.isLoggedIn);

router.get('/', viewControllers.getOverview);
router.get('/login', viewControllers.getLoginForm);
router.get('/tour/:slug', viewControllers.getTourDetails);

module.exports = router;
