const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: [true, 'Link required'],
    validate: {
      validator(v) {
        const regex = /https?:\/\/(www\.)?([/a-zA-Z\d\-._~:?#[\]@!$&'()*+,;=]+\.)+(\/#)?/;
        return regex.test(v);
      },
      message: (props) => `${props.value} is not a valid url`,
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Link required'],
    validate: {
      validator(v) {
        const regex = /https?:\/\/(www\.)?([/a-zA-Z\d\-._~:?#[\]@!$&'()*+,;=]+\.)+(\/#)?/;
        return regex.test(v);
      },
      message: (props) => `${props.value} is not a valid url`,
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Link required'],
    validate: {
      validator(v) {
        const regex = /https?:\/\/(www\.)?([/a-zA-Z\d\-._~:?#[\]@!$&'()*+,;=]+\.)+(\/#)?/;
        return regex.test(v);
      },
      message: (props) => `${props.value} is not a valid url`,
    },
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('movie', movieSchema);
