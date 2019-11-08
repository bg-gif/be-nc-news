const usersRouter = require('express').Router();
const {
	getAllUsers,
	getUserById,
	postUser
} = require('../controllers/users-controller.js');
const { handle405s } = require('../errors');

usersRouter
	.route('/')
	.get(getAllUsers)
	.post(postUser)
	.all(handle405s);

usersRouter
	.route('/:username')
	.get(getUserById)
	.all(handle405s);

module.exports = usersRouter;
