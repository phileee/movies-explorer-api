require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const signUser = require('./routes/sign');
const routers = require('./routes/routers');

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
app.use(requestLogger);
app.use(limiter);
app.use(cors(corsOrigins));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(signUser);

app.use(auth, routers);

app.get('/signout', auth, (req, res, next) => {
  try {
    return res
      .clearCookie('jwt', {
        sameSite: 'None',
        secure: 'True',
        // domain: '.moviephile.nomoredomains.sbs',
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
