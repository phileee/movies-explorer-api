require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routers = require('./routes/routers');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const middlewareError = require('./middlewares/middleware-errors');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;

mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.DATABASE : 'mongodb://localhost:27017/moviesdb');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const corsOrigins = {
  origin: ['http://moviephile.nomoredomains.sbs', 'https://moviephile.nomoredomains.sbs'],
  credentials: true,
};

const app = express();

app.use(helmet());
app.use(limiter);
app.use(cors(corsOrigins));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth, routers);

app.get('/signout', (req, res, next) => {
  try {
    return res
      .clearCookie('jwt', {
        sameSite: 'None',
        secure: 'True',
        domain: '.moviephilenomoredomains.sbs',
      })
      .header({
        'Access-Control-Allow-Credentials': 'true',
      })
      .send({ message: 'Куки успешно удалены' });
  } catch (err) {
    return next(err);
  }
});

app.use(auth, () => {
  throw new NotFoundError('Страницы не существует');
});

app.use(errorLogger);

app.use(errors());
app.use(middlewareError);

app.listen(PORT);
