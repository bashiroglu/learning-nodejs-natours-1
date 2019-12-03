const express = require('express');
const userControllers = require('../controllers/userControllers');
const router = express.Router();
router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.addNewUser);

router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
