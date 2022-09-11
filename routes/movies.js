const routerMovie = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

routerMovie.get('/movies', getMovies);

routerMovie.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string()
      .required().pattern(/https?:\/\/(www\.)?[/a-zA-Z\d\-._~:?#[\]@!$&'()*+,;=]+\.([/a-zA-Z\d\-._~:?#[\]@!$&'()*+,;=]+)(\/#)?/),
    trailerLink: Joi.string()
      .required().pattern(/https?:\/\/(www\.)?[/a-zA-Z\d\-._~:?#[\]@!$&'()*+,;=]+\.([/a-zA-Z\d\-._~:?#[\]@!$&'()*+,;=]+)(\/#)?/),
    thumbnail: Joi.string()
      .required().pattern(/https?:\/\/(www\.)?[/a-zA-Z\d\-._~:?#[\]@!$&'()*+,;=]+\.([/a-zA-Z\d\-._~:?#[\]@!$&'()*+,;=]+)(\/#)?/),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

routerMovie.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().alphanum().length(24)
      .hex(),
  }),
}), deleteMovie);

module.exports = routerMovie;
