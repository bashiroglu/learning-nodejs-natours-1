exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'All tours'
  });
};

exports.getTourDetails = (req, res) => {
  res.status(200).render('tour', {
    title: 'tour'
  });
};
