const express = require('express');

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route has not defined yet'
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route has not defined yet'
  });
};
const addNewUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route has not defined yet'
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route has not defined yet'
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route has not defined yet'
  });
};

const router = express.Router();
router
  .route('/')
  .get(getAllUsers)
  .post(addNewUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
