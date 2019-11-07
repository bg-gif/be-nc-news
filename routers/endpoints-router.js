const endPointsRouter = require('express').Router();
const { handle405s } = require('../errors');

const endPoints = (req, res, next) => {
	res.status(200).send(ends);
};

endPointsRouter
	.route('/')
	.get(endPoints)
	.all(handle405s);

module.exports = endPointsRouter;
