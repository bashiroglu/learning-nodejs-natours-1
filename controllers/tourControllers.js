const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  // console.log(`tour id is ${val}`);
  const id = Number(req.params.id);
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id'
    });
  }
  next();
};
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'missing name or price'
    });
  }
  next();
};
exports.getAllTours = (req, res) => {
  // console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

exports.getTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find(tourOfMap => tourOfMap.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'tour updated'
    }
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};

exports.addNewTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  // eslint-disable-next-line prefer-object-spread
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
};
