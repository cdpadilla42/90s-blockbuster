const Movie = require('../models/movie');
const Director = require('../models/director');
const Genre = require('../models/genre');
const MovieInstance = require('../models/movieinstance');
const expressValidator = require('express-validator');

const async = require('async');

exports.index = (req, res) => {
  async.parallel(
    {
      director_count: (callback) => {
        Director.countDocuments({}, callback);
      },
      genre_count: (callback) => {
        Genre.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render('index', {
        title: 'Local Blockbuster Home',
        error: err,
        data: results,
      });
    }
  );
};

// Display List of movies
exports.movie_list = (req, res, next) => {
  Movie.find({}, 'title director')
    .populate('director')
    .exec((err, list_movies) => {
      if (err) return next(err);
      res.render('movie_list', {
        title: 'Movie List',
        movie_list: list_movies,
      });
    });
};

// Display detail of movie
exports.movie_detail = (req, res) => {
  res.send('NOT IMPLEMENTED: movie detail: ' + req.params.id);
};

// Display create movie GET
exports.movie_create_get = (req, res, next) => {
  // Get all directors and genres for adding to our book
  async.parallel(
    {
      directors: function (callback) {
        Director.find(callback);
      },
      genres: function (callback) {
        Genre.find(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      res.render('movie_form.hbs', {
        title: 'Create new Movie',
        directors: results.directors,
        genres: results.genres,
      });
    }
  );
};

// Handle create movie POST
exports.movie_create_post = [
  // Convert genre to array
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined') {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
      next();
    }
  },
  expressValidator
    .body('title', 'Title must not be empty')
    .trim()
    .isLength({ min: 1 }),
  expressValidator
    .body('director', 'Director must not be empty')
    .trim()
    .isLength({ min: 1 }),
  expressValidator
    .body('summary', 'Summary must not be empty')
    .trim()
    .isLength({ min: 1 }),
  expressValidator
    .body('isbn', 'isbn must not be empty')
    .trim()
    .isLength({ min: 1 }),

  // Sanitize fields with wildcar
  expressValidator.sanitizeBody('*').escape(),

  // Process request after validation and sanitization
  (req, res, next) => {
    const errors = expressValidator.validationResult(req);

    // Create a movie object with escaped and trimmed data
    const movie = new Movie({
      title: req.body.title,
      director: req.body.director,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          directors: function (callback) {
            Director.find(callback);
          },
          genres: function (callback) {
            Genre.find(callback);
          },
        },
        function (err, results) {
          if (err) return next(err);

          // Mark selected genres as checked
          // for (let i = 0; i < results.genres.length; i++) {
          //   if (movie.genre.indexOf(results.genres[i]._id) > -1) {
          //     results.genres[i].checked = 'true';
          //   }
          // }

          res.render('movie_form', {
            title: 'Create Movie',
            directors: results.directors,
            genres: results.genres,
            movie: movie,
            errors: errors.array(),
          });
          return;
        }
      );
    } else {
      movie.save(function (err) {
        if (err) return next(err);
        res.redirect(movie.url);
      });
    }
  },
];

// Display update movie GET
exports.movie_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: movie update GET');
};

// Handle update movie POST
exports.movie_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: movie update POST');
};

// Display delete movie GET
exports.movie_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: movie delete GET');
};

// Handle delete movie POST
exports.movie_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: movie delete POST');
};
