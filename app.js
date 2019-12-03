const fs = require('fs');
const express = require('express');
const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'hello from server', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.json('post request');
// });

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});
app.get('/api/v1/tours/:id', (req, res) => {
  // console.log(req.params);

  const id = Number(req.params.id);
  // if (id > tours.length) {

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
});
app.patch('/api/v1/tours/:id', (req, res) => {
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
});
app.delete('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  //   const newId = tours.length;
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
});

const port = 3000;
app.listen(port, () => console.log(`server run in port: ${port}`));
