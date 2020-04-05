const express = require('express');
const router = express.Router();

// Require controller modules
const movie_controller = require('../controllers/movieController');
const director_controller = require('../controllers/directorController');
const genre_controller = require('../controllers/genreController');
const movie_instance_controller = require('../controllers/movieInstranceController');

/// MOVIE ROUTES ///

// GET catalog home page
router.get('/', movie_controller.index);

// GET for creating a movie
// * must come before routes that display Book (uses id)
router.get('/movie/create', movie_controller.movie_create_get);

// POST for creating a movie
router.post('/movie/create', movie_controller.movie_create_post);

// GET request for deleting a movie
router.get('/movie/:id/delete', movie_controller.movie_delete_get);

// POST request for deleting a movie
router.post('/movie/:id/delete', movie_controller.movie_delete_post);

// GET request for listing all movies
router.get('/movies', movie_controller.movie_list);

// GET request for details on one movie
router.get('/movie/:id', movie_controller.movie_detail);

// GET request for updating a movie
router.get('/movie/:id/update', movie_controller.movie_update_get);

// POST request for updating a movie
router.post('/movie/:id/update', movie_controller.movie_update_post);

/// DIRECTOR ROUTES ///

// GET request for creating a director
router.get('/director/create', director_controller.director_create_get);

// POST request for creating a director
router.post('/director/create', director_controller.director_create_post);

// GET request for deleting a director
router.get('/director/:id/delete', director_controller.director_delete_get);

// POST request for deleting a director
router.post('/director/:id/delete', director_controller.director_delete_post);

// GET request for updating a director
router.get('/director/:id/update', director_controller.director_update_get);

// POST request for updating a director
router.post('/director/:id/update', director_controller.director_update_post);

// GET request for showing a list of directors
router.get('/directors', director_controller.director_list);

// GET request for details on one director
router.get('/director/:id', director_controller.director_detail);

/// GENRE ROUTES ///

// GET request for creating a genre
// * must come first
router.get('/genre/create', genre_controller.genre_create_get);

// POST request for creating a genre
router.post('/genre/create', genre_controller.genre_create_post);

// GET request for deleting a genre
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request for deleting a genre
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request for updating a genre
router.get('/genre/:id/update', genre_controller.genre_update_get);

//POST request for updating a genre
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET Request for showing list of genres
router.get('/genres', genre_controller.genre_list);

// GET request for showing single genre
router.get('/genre/:id', genre_controller.genre_detail);

/// MOVIEINSTANCE ROUTES ///

// GET request for creating a movie instance
// * must come first
router.get(
  '/movieinstance/create',
  movie_instance_controller.movieInstance_create_get
);

// POST request for creating a movie instance
router.post(
  '/movieinstance/create',
  movie_instance_controller.movieInstance_create_post
);

// GET request for deleting a movie instance
router.get(
  '/movieinstance/:id/delete',
  movie_instance_controller.movieInstance_delete_get
);

// POST request for deleting a movie instance
router.post(
  '/movieinstance/:id/delete',
  movie_instance_controller.movieInstance_delete_post
);

// GET request for updating a movie instance
router.get(
  '/movieinstance/:id/update',
  movie_instance_controller.movieInstance_update_get
);

// POST request for updating a movie instance
router.post(
  '/movieinstance/:id/update',
  movie_instance_controller.movieInstance_update_post
);

// GET request to show list of movieInstances
router.get('/movieinstance', movie_instance_controller.movieInstance_list);

router.get(
  '/movieinstance/:id',
  movie_instance_controller.movieInstance_detail
);

module.exports = router;
