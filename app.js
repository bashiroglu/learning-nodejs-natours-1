const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));
app.use(express.json());

// app.use((res, req, next) => {
//   console.log('hello from the middleware');
//   next();
// });

// app.use((res, req, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

const getTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find(tour => tour.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

const updateTour = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'tour updated'
    }
  });
};

const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id'
    });
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
};

const addNewTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};

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

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', addNewTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(addNewTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app
  .route('/api/v1/users')
  .get(getAllUsers)
  .post(addNewUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

const port = 3000;
app.listen(port, () => console.log(`server run in port: ${port}`));
