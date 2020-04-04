var MovieInstance = require('../models/movieinstance');
var Movie = require('../models/movie');
var expressValidator = require('express-validator');

// Display list of all MovieInstrances
exports.movieInstance_list = (req, res, next) => {
  movieInstance
    .find()
    .populate('movie')
    .exec((err, list_movieinstances) => {
      if (err) return next(err);
      res.render('movieinstance_list', {
        title: 'Movie Instance List',
        movieinstance_list: list_movieinstances,
      });
    });
};

// Display details page for MovieInstrances
exports.movieInstance_detail = (req, res) => {
  res.send('NOT IMPLEMENTED: Movie Instanc Detail: ' + req.params.id);
};

// Display create MovieInstrances w/ GET
exports.movieInstance_create_get = (req, res, next) => {
  Movie.find({}, 'title').exec(function (err, movies) {
    if (err) return next(err);
    res.render('movie_instance_form', {
      title: 'Add a movie instance',
      movie_list: movies,
    });
  });
};

// Handle movie instance creation with POST
exports.movieInstance_create_post = [
  // Validate
  expressValidator
    .body('movie', 'movie must be specified')
    .trim()
    .isLength({ min: 1 }),
  expressValidator.body('imprint').trim().isLength({ min: 1 }),
  expressValidator
    .body('dueDate', 'Invalid Date')
    .optional({ checkFalsy: true })
    .isISO8601(),
  // Sanitize
  expressValidator.sanitizeBody('movie').escape(),
  expressValidator.sanitizeBody('imprint').escape(),
  expressValidator.sanitizeBody('status').trim().escape(),
  expressValidator.sanitizeBody('dueDate').toDate(),

  // Process request
  (req, res, next) => {
    // Store Errors
    const errors = expressValidator.validationResult(req);
    // Create new MovieInstance
    let movieInstance = new MovieInstance({
      movie: req.body.movie,
      status: req.body.status,
      dueDate: req.body.dueDate,
      imprtint: req.body.imprint,
    });
    // if errors
    if (!errors.isEmpty()) {
      // Redirect to form with errors and created Movie Instance
      Movie.find({}, 'title').exec(function (err, movies) {
        if (err) {
          return next(err);
        }
        res.render('movie_instance_form', {
          title: 'Add a movie instance',
          movie_list: movies,
          selected_movie: movieInstance.movie._id,
          errors: errors.array(),
          movieInstance: movieInstance,
        });
      });
      return;
    } else {
      // if (err) return next(err);
      // Save & Redirect to bookinstance url
      movieInstance.save(function (err) {
        if (err) return next(err);
        res.redirect(movieInstance.url);

        // res.send('done!');
      });
    }
  },
];

// Display delete MovieInstrances w/ GET
exports.movieInstance_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Movie Instance delete GET');
};

// Handle delete MovieInstrances w/ POST
exports.movieInstance_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Movie Instance delete Post');
};

// Display update MovieInstrances w/ GET
exports.movieInstance_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Movie Instance update GET');
};

// Display update MovieInstrances w/ POST
exports.movieInstance_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Movie Instance update POST');
};
