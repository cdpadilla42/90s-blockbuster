var director = require('../models/director');

// Display List of all Directors
exports.director_list = (req, res) => {
  res.send('NOT IMPLEMENTED: director list');
};

// Display detail page for a specific director
exports.director_detail = (req, res) => {
  res.send('NOT IMPLEMENTED: director detail: ' + req.params.id);
};

// Display director create form on GET
exports.director_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: director create GET');
};

// Handle director create on POST
exports.director_create_post = (req, res) => {
  res.send('NOT IMPL: director create POST');
};

// Display director delete form on GET
exports.director_delete_get = (req, res) => {
  res.send('NOTIMP: director delete GET');
};

// Handle director delete POST
exports.director_delete_post = (req, res) => {
  res.send('NOTIMP: director delete POST');
};

// Display director update on GET
exports.director_update_get = (req, res) => {
  res.send('NOT IMP: director update on GET');
};

// Handle director update on POST
exports.director_update_post = (req, res) => {
  res.send('NOT IMP: director update on POST');
};
