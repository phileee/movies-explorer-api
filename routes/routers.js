const routers = require('express').Router();
const routerUser = require('./users');
const routerMovie = require('./movies');

routers.use(routerUser);
routers.use(routerMovie);

module.exports = routers;
