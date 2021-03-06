var Director = require('../models/director');
const Movie = require('../models/movie');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const async = require('async');

// Display List of all Directors
exports.director_list = (req, res, err) => {
  Director.find()
    .populate('director')
    .sort([['family_name', 'ascending']])
    .exec((err, list_directors) => {
      if (err) return next(err);
      res.render('director_list', {
        title: 'Director List',
        director_list: list_directors,
      });
    });
};

// Display detail page for a specific director
exports.director_detail = (req, res, next) => {
  async.parallel(
    {
      director: function (callback) {
        Director.findById(req.params.id).exec(callback);
      },
      director_movies: function (callback) {
        Movie.find({ director: req.params.id }, 'title summary').exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.director == null) {
        var err = new Error('Director not found');
        err.status = 404;
        return next(err);
      }
      res.render('director_detail', {
        title: 'Director Details',
        director: results.director,
        director_movies: results.directors_movies,
      });
    }
  );
};

// Display director create form on GET
exports.director_create_get = (req, res, next) => {
  res.render('director_form', { title: 'Create Director' });
};

// Handle director create on POST
exports.director_create_post = [
  // validate fields
  body('first_name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Must have first name')
    .isAlphanumeric()
    .withMessage('First name has non alphanumeric value'),
  body('family_name')
    .isLength({ min: 1 })
    .trim()
    .withMessage('Family name required')
    .isAlphanumeric()
    .withMessage('Family name must be alpha-numeric'),
  body('date_of_birth', 'Invalid date of birth')
    .optional({ checkFalsy: true })
    .isISO8601(),
  body('date_of_death', 'Invalid date of death')
    .optional({ checkFalsy: true })
    .isISO8601(),

  // Sanitize fields
  sanitizeBody('first_name').escape(),
  sanitizeBody('family_name').escape(),
  sanitizeBody('date_of_birth').toDate(),
  sanitizeBody('date_of_death').toDate(),

  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('director_form', {
        title: 'Create Director',
        director: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid

      // Create an Director object with escaped and trimmed data
      var director = new Director({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
      });
      director.save(function (err) {
        if (err) return next(err);
        res.redirect(director.url);
      });
    }
  },
];

// Display director delete form on GET
exports.director_delete_get = (req, res, next) => {
  async.parallel(
    {
      director: function (callback) {
        Director.findById(req.params.id).exec(callback);
      },
      director_movies: function (callback) {
        Movie.find({ director: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.director == null) {
        res.redirect('/catalog/directors');
      }
      res.render('director_delete', {
        title: 'Delete Director',
        director: results.director,
        director_movies: results.director_movies,
      });
    }
  );
};

// Handle director delete POST
exports.director_delete_post = (req, res) => {
  async.parallel(
    {
      director: function (callback) {
        Director.findById(req.body.directorid).exec(callback);
      },
      directors_movies: function (callback) {
        Movie.find({ director: req.body.directorid }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.directors_movies.length > 0) {
        // Director has movies. Render in same way as a GET route
        res.render('director_delete', {
          title: 'Delete Director',
          director: results.director,
          director_movies: results.directors_movies,
        });
        return;
      } else {
        // Director has no books. Delete object and redirect to list of Directors
        Director.findByIdAndRemove(req.body.directorid, function deleteDirector(
          err
        ) {
          if (err) return next(err);
          res.redirect('/catalog/directors');
        });
      }
    }
  );
};
// Display director update on GET
exports.director_update_get = (req, res, next) => {
  // import the director
  Director.findById(req.params.id).exec((err, director) => {
    // check for errors
    if (err) return next(err);
    if (director == null) {
      const error = new Error('Director not found');
      error.status = 404;
      return next(error);
    }
    // render form with info
    res.render('director_form', {
      title: 'Update Director',
      director,
    });
  });
};

// Handle director update on POST
exports.director_update_post = [
  // validate and sanitize data
  body('first_name', 'First Name required').trim().isLength({ min: 1 }),
  body('family_name', 'Family Name required').trim().isLength({ min: 1 }),
  body('date_of_birth', 'Invalid DOB')
    .optional({ checkFalsy: true })
    .isISO8601(),
  body('date_of_death', 'Invalid Date of Death')
    .optional({ checkFalsy: true })
    .isISO8601(),

  sanitizeBody('first_name').escape(),
  sanitizeBody('family_name').escape(),
  sanitizeBody('date_of_birth').escape(),
  sanitizeBody('date_of_death').escape(),

  (req, res, next) => {
    const director = new Director({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_death: req.body.date_of_death,
      date_of_birth: req.body.date_of_birth,
      _id: req.params.id,
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('director_form', {
        title: 'Update Director',
        director,
        errors: errors.array(),
      });
      return;
    } else {
      // Find director in DB
      Director.findByIdAndUpdate(
        req.params.id,
        director,
        {},
        (err, thedirector) => {
          if (err) return next(err);
          res.redirect(thedirector.url);
        }
      );
    }
  },
];
