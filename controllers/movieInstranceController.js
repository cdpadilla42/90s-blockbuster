var MovieInstance = require('../models/movieinstance');
var Movie = require('../models/movie');
var expressValidator = require('express-validator');
var async = require('async');

// Display list of all MovieInstrances
exports.movieInstance_list = (req, res, next) => {
  MovieInstance.find()
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
exports.movieInstance_detail = (req, res, next) => {
  MovieInstance.findById(req.params.id)
    .populate('movie')
    .exec(function (err, movieinstance) {
      if (err) return next(err);
      if (movieinstance == null) {
        var err = new Error('Movie copy not found');
        err.status = 404;
        return next(err);
      }
      res.render('movieinstance_detail', {
        movieinstance,
      });
    });
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
    // find movie id by name?

    // Store Errors
    const errors = expressValidator.validationResult(req);
    // Create new MovieInstance
    let movieInstance = new MovieInstance({
      movie: req.body.movie,
      status: req.body.status,
      dueDate: req.body.dueDate,
      imprint: req.body.imprint,
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
      });
    }
  },
];

// Display delete MovieInstrances w/ GET
exports.movieInstance_delete_get = (req, res, next) => {
  // only needs to render the delete movie instance page. Needs data on the movie being deleted
  // find the movie instance
  MovieInstance.findById(req.params.id, (err, movieinstance) => {
    // if error, return error
    if (err) return next(err);
    if (movieinstance == null) {
      res.redirect('/catalog/movieinstance');
    }
    // if success, render page
    res.render('movieinstance_delete', {
      title: 'Delete Movie instance',
      movieinstance,
    });
  });
};

// Handle delete MovieInstrances w/ POST
exports.movieInstance_delete_post = (req, res, next) => {
  MovieInstance.findByIdAndRemove(
    req.body.movieinstanceid,
    function deleteMovieInstance(err) {
      if (err) return next(err);
      res.redirect('/catalog/movieinstance');
    }
  );
};

// Display update MovieInstrances w/ GET
exports.movieInstance_update_get = (req, res) => {
  // find the instance & movie list
  async.parallel(
    {
      movies: function (callback) {
        Movie.find({}).exec(callback);
      },
      movieInstance: function (callback) {
        MovieInstance.findById(req.params.id).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.movieInstance == null) {
        const error = new Error('Instance not found');
        error.status = 404;
        return next(error);
      }
      res.render('movie_instance_form', {
        title: 'Update Movie Instance',
        movie_list: results.movies,
        movieInstance: results.movieInstance,
      });
    }
  );
};

// Display update MovieInstrances w/ POST
exports.movieInstance_update_post = [
  // validate data
  expressValidator
    .body('status', 'status must not be empty')
    .trim()
    .isLength({ min: 1 }),
  expressValidator.body('dueDate'), // TODO validate date
  expressValidator.body('imprint').trim().isLength({ min: 1 }),

  // sanitize data
  expressValidator.sanitizeBody('movie').escape(),
  expressValidator.sanitizeBody('status').escape(),
  expressValidator.sanitizeBody('dueDate').escape(),
  expressValidator.sanitizeBody('imprint').escape(),

  // Process request
  (req, res, next) => {
    // Store errors
    const errors = expressValidator.validationResult(req);

    // Create instance from validated & sanitized data
    const movieInstance = new MovieInstance({
      movie: req.body.movie,
      status: req.body.status,
      dueDate: req.body.dueDate,
      imprint: req.body.imprint,
      _id: req.params.id,
    });
    // if errors
    if (!errors.isEmpty()) {
      // get movie list
      Movie.find({}).exec(function (err, results) {
        // check for err
        if (err) return next(err);
        // render form with current movieInstance
        res.render('movie_instance_form', {
          title: 'Update Movie Instance',
          movie_list: results,
          movieInstance,
        });
        return;
      });
    }
    // if no errors
    // save update instance
    MovieInstance.findByIdAndUpdate(
      req.params.id,
      movieInstance,
      {},
      (err, theinstance) => {
        if (err) return next(err);
        res.redirect(theinstance.url);
      }
    );
  },
];
