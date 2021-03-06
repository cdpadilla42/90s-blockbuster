const Genre = require('../models/genre');
const Movie = require('../models/movie');
const async = require('async');
const validator = require('express-validator');

// Display list of Genres
exports.genre_list = (req, res, next) => {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec((err, list_genres) => {
      if (err) return next(err);
      res.render('genre_list', {
        title: 'Genre List',
        genre_list: list_genres,
      });
    });
};

// Display details of Genres
exports.genre_detail = (req, res, next) => {
  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(req.params.id).exec(callback);
      },

      genre_books: function (callback) {
        Genre.find({ genre: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.genre == null) {
        var err = new Error('Genre not found');
        err.status = 404;
        return next(err);
      }

      res.render('genre_detail', {
        title: 'Genre Detail',
        genre: results.genre,
        genre_movies: results.genre_movies,
      });
    }
  );
};

// Display create Genres GET
exports.genre_create_get = (req, res) => {
  res.render('genre_form', { title: 'Create Genre' });
};

// Handle create Genres POST
exports.genre_create_post = [
  // Validate that the name field is not empty
  validator.body('name', 'Genre name required').trim().isLength({ min: 1 }),

  // Sanitize (escape) the name field.
  validator.sanitizeBody('name').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    const errors = validator.validationResult(req);

    // Create a genre object with escaped and trimmed data
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // Render form again with sanitized values/error msgs
      res.render('genre_form', {
        title: 'Create Genre',
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data is valid
      // Check if Genre with same name already exists
      Genre.findOne({ name: req.body.name }).exec(function (err, found_genre) {
        if (err) return next(err);

        if (found_genre) {
          // Genre exists, redirect to detail page
          res.redirect(found_genre.url);
        } else {
          genre.save(function (err) {
            if (err) return next(err);
            res.redirect(genre.url);
          });
        }
      });
    }
  },
];

// Display Update Genres GET
exports.genre_update_get = (req, res, next) => {
  // get genre id
  Genre.findById(req.params.id).exec((err, genre) => {
    // render page
    res.render('genre_form', {
      title: 'Update Genre',
      genre,
    });
  });
};

// Handle update Genres POST
exports.genre_update_post = [
  // Run middleware
  // Validate response
  validator.body('name').trim().isLength({ min: 1 }),

  // Sanitize response
  validator.sanitizeBody('name').escape(),

  // Process request
  (req, res, next) => {
    const errors = validator.validationResult(req);
    // create the updated genre
    const genre = new Genre({
      name: req.body.name,
      _id: req.params.id,
    });
    // if errors, return
    if (!errors.isEmpty()) {
      res.render('genre_form', {
        title: 'Update Genre',
        genre,
        errors: errors.array(),
      });
      return;
    } else {
      // if no errors, update and redirect
      Genre.findByIdAndUpdate(req.params.id, genre, {}, (err, thegenre) => {
        if (err) return next(err);
        res.redirect(thegenre.url);
      });
    }
  },
];

// Display delete Genres GET
exports.genre_delete_get = (req, res, next) => {
  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      movies: function (callback) {
        Movie.find({ genre: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      // check for err
      if (err) return next(err);
      //git  Redirect if not found
      if (results.genre == null) {
        res.redirect('/catalog/genres');
      }
      // render appropriate template
      res.render('genre_delete', {
        title: 'Delete Genre',
        genre: results.genre,
        movies: results.movies,
      });
    }
  );
};

// Handle delete Genres GET
exports.genre_delete_post = (req, res, next) => {
  // get genre and movies
  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(req.body.genreid).exec(callback);
      },
      movies: function (callback) {
        Movie.find({ genre: req.body.genreid }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.movies.length > 0) {
        res.render('genre_delete', {
          title: 'Delete Genre',
          movies: results.movies,
          genre: results.genre,
        });
      } else {
        Genre.findByIdAndRemove(req.body.genreid, function deleteGenre() {
          if (err) return next(err);
          res.redirect('/catalog/genres');
        });
      }
    }
  );
  // if movies
  // redirect to screen. Movies must be deleted
  // if no movies
  // process genre delete.
  // redirect to genre list
};
