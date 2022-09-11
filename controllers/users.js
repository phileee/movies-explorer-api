const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthError = require('../errors/auth-err');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-req-err');
const ConflictError = require('../errors/conflict-err');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Ошибка авторизации');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Ошибка авторизации');
          }
          return user;
        })
        .then((auth) => {
          const token = jwt.sign({ _id: auth._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
          res
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              sameSite: 'None',
              secure: 'True',
              // domain: '.moviephile.nomoredomains.sbs',
            })
            .header('Access-Control-Allow-Credentials', true)
            .send({ message: 'token created' });
        });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.header('Access-Control-Allow-Credentials', true).send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.header('Access-Control-Allow-Credentials', true).send({ name: user.name, email: user.email }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с данным e-mail существует'));
      }
      return next(err);
    });
};

module.exports.patchUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      return res.header('Access-Control-Allow-Credentials', true).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с данным e-mail существует'));
      }
      return next(err);
    });
};
