const Movie = require('../models/movie');
const Director = require('../models/director');
const Genre = require('../models/genre');
const MovieInstance = require('../models/movieinstance');

const async = require('async');

exports.index = (req, res) => {
  async.parallel(
    {
      director_count: callback => {
        Director.countDocuments({}, callback);
      },
      genre_count: callback => {
        Genre.countDocuments({}, callback);
      }
    },
    (err, results) => {
      res.render('index', {
        title: 'Local Blockbuster Home',
        error: err,
        data: results
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
        movie_list: list_movies
      });
    });
};

// Display detail of movie
exports.movie_detail = (req, res) => {
  res.send('NOT IMPLEMENTED: movie detail: ' + req.params.id);
};

// Display create movie GET
exports.movie_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: movie create GET');
};

// Handle create movie POST
exports.movie_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: movie create POST');
};

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
