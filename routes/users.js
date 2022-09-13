const routerUser = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserInfo, patchUserInfo,
} = require('../controllers/users');

routerUser.get('/users/me', getUserInfo);

routerUser.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), patchUserInfo);

module.exports = routerUser;
