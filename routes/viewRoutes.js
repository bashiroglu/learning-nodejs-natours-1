const express = require('express');

const viewControllers = require('../controllers/viewControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

router.get('/', authControllers.isLoggedIn, viewControllers.getOverview);
router.get('/login', authControllers.isLoggedIn, viewControllers.getLoginForm);
router.get(
  '/tour/:slug',
  authControllers.isLoggedIn,
  viewControllers.getTourDetails
);
router.get('/me', authControllers.protect, viewControllers.getAccount);

router.post(
  '/submit-user-data',
  authControllers.protect,
  viewControllers.updateUserData
);

module.exports = router;
