const topicsRouter = require('express').Router();
const { getAllTopics } = require('../controllers/topics-controller.js');
const { handle405s } = require('../errors');

topicsRouter
	.route('/')
	.get(getAllTopics)
	.all(handle405s);

module.exports = topicsRouter;
