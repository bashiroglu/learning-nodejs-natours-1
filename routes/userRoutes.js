const express = require('express');
const userControllers = require('../controllers/userControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);
router.get('/logout', authControllers.logout);

router.post('/forgetPassword', authControllers.forgetPassword);
router.patch('/resetPassword/:token', authControllers.resetPassword);

router.use(authControllers.protect);
router.patch('/updatePassword', authControllers.updatePassword);

router.get('/me', userControllers.getMe, userControllers.getUser);
router.patch('/updateMe', userControllers.updateMe);
router.delete('/deleteMe', userControllers.deleteMe);

router.use(authControllers.restrictTo('admin'));

router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.addNewUser);

router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(
    authControllers.restrictTo('user', 'admin'),
    userControllers.updateUser
  )
  .delete(
    authControllers.restrictTo('user', 'admin'),
    userControllers.deleteUser
  );

module.exports = router;
