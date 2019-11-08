const loginRouter = require('express').Router();
const { postLogin } = require('../controllers/login-controller');

loginRouter.route('/').post(postLogin);

module.exports = loginRouter;
